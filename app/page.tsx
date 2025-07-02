"use client";

import React, { useState } from 'react';
import RoomList from '@/components/RoomList';
import ChatWindow from '@/components/ChatWindow';
import EndpointConfig from '@/components/EndpointConfig';

interface Room {
  id: number;
  name: string;
  chatbot_endpoint_url: string | null;
}

export default function HomePage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelectRoom = async (roomId: number) => {
    // Fetch room details to get endpoint URL
    const res = await fetch('/api/rooms');
    const data = await res.json();
    const room = (data.rooms || []).find((r: Room) => r.id === roomId) || null;
    setSelectedRoom(room);
    setDrawerOpen(false); // Close drawer after selecting
  };

  const handleRoomCreated = (room: Room) => {
    setSelectedRoom(room);
    setDrawerOpen(false); // Close drawer after creating
  };


  const handleEndpointUpdated = (newUrl: string) => {
    if (selectedRoom) {
      setSelectedRoom({ ...selectedRoom, chatbot_endpoint_url: newUrl });
    }
  };


  return (
    <main className="min-h-screen bg-gray-900 flex flex-col relative">
      {/* Hamburger button always visible */}
      <button
        className="absolute top-4 left-4 z-30 bg-gray-800 text-gray-100 p-2 rounded-lg shadow focus:outline-none"
        onClick={() => setDrawerOpen(true)}
        aria-label="Otwórz menu czatów"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {/* Overlay for drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Sidebar/Drawer - always hidden by default, shown only when open */}
      <div
        className={`fixed z-30 top-0 left-0 h-full w-72 max-w-full transform transition-transform duration-300
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-gray-900 p-0 flex-shrink-0 flex items-start justify-center min-h-[300px]`}
        style={{ boxShadow: drawerOpen ? '0 0 0 9999px rgba(0,0,0,0.5)' : undefined }}
      >
        <RoomList
          selectedRoom={selectedRoom || null}
          onSelectRoom={handleSelectRoom}
          onRoomCreated={handleRoomCreated}
          handleEndpointUpdated={handleEndpointUpdated}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-6 gap-6 h-full ml-0">
        <div className="flex-1 flex items-center justify-center">
          <ChatWindow
            roomId={selectedRoom?.id || null}
            chatbotEndpointUrl={selectedRoom?.chatbot_endpoint_url || null}
          />
        </div>
        
      </div>
    </main>
  );
}
