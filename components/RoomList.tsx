"use client";

import React, { useEffect, useState } from 'react';
import EndpointConfig from './EndpointConfig';

interface Room {
  id: number;
  name: string;
  chatbot_endpoint_url: string | null;
}

interface RoomListProps {
  selectedRoom: Room | null;
  onSelectRoom: (roomId: number) => void;
  onRoomCreated: (room: Room) => void;
  handleEndpointUpdated: (newUrl: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ selectedRoom, onSelectRoom, onRoomCreated, handleEndpointUpdated }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    const res = await fetch('/api/rooms');
    const data = await res.json();
    setRooms(data.rooms || []);
    setLoading(false);
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newRoomName }),
    });
    const data = await res.json();
    if (data.room) {
      setRooms([...rooms, data.room]);
      setNewRoomName('');
      onRoomCreated(data.room);
    }
  };

  return (
    <div className="w-full max-w-xs h-full p-6 bg-gray-900 rounded-xl shadow-lg flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-gray-100 tracking-wide">Czaty</h2>
      <EndpointConfig
          roomId={selectedRoom?.id || null}
          chatbotEndpointUrl={selectedRoom?.chatbot_endpoint_url || null}
          onEndpointUpdated={handleEndpointUpdated}
        />
      <form onSubmit={handleCreateRoom} className="flex mb-6 gap-2">
        <input
          className="flex-1 bg-gray-800 border-none rounded px-3 py-2 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Nowy czat..."
          value={newRoomName}
          onChange={e => setNewRoomName(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors text-sm font-semibold" type="submit">+</button>
      </form>
      <div className="space-y-2 flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-gray-400 text-sm">Ładowanie...</div>
        ) : rooms.length === 0 ? (
          <div className="text-gray-500 text-sm">Brak czatów.</div>
        ) : (
          rooms.map(room => (
            <button
              key={room.id}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${selectedRoom?.id === room.id ? 'bg-blue-700 text-white shadow' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}
              onClick={() => onSelectRoom(room.id)}
            >
              {room.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default RoomList; 