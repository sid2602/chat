"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Message {
  id: number;
  room_id: number;
  sender_type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatWindowProps {
  roomId: number | null;
  chatbotEndpointUrl: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ roomId, chatbotEndpointUrl }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (roomId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [roomId]);

  const fetchMessages = async () => {
    if (!roomId) return;
    const res = await fetch(`/api/rooms/${roomId}/messages`);
    const data = await res.json();
    setMessages(data.messages || []);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !roomId) return;
    setLoading(true);
    // Send user message
    await fetch(`/api/rooms/${roomId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_type: 'user', content: input }),
    });

    setInput('');
    await fetchMessages();
    // // If chatbot endpoint is set, send message to chatbot and store response
    if (chatbotEndpointUrl) {
      try {


        const botRes = await fetch(chatbotEndpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: messages.map(msg => ({ role: msg.sender_type, content: msg.content })) }),
        });
        const botData = await botRes.json();

        if (botData) {
          await fetch(`/api/rooms/${roomId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender_type: 'assistant', content: botData[botData.length - 1].content }),
          });
          await fetchMessages();
        }
      } catch (err) {
        // Optionally handle chatbot error
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!roomId) {
    return <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-900 rounded-xl">Wybierz czat, aby rozpocząć rozmowę.</div>;
  }

  return (
    <div className="flex flex-col min-h-[85vh] bg-gray-800 rounded-xl shadow-lg p-6 w-[80%]">
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center mt-8">Brak wiadomości.</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`mb-3 flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-md break-words text-base shadow ${msg.sender_type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                {msg.content}
                <span className="block text-xs text-gray-400 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2 mt-2">
        <input
          className="flex-1 bg-gray-700 border-none rounded-lg px-4 py-2 text-base text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Napisz wiadomość..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors" type="submit" disabled={loading || !input.trim()}>
          Wyślij
        </button>
      </form>
    </div>
  );
};

export default ChatWindow; 