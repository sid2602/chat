"use client";

import React, { useState } from 'react';

interface EndpointConfigProps {
    roomId: number | null;
    chatbotEndpointUrl: string | null;
    onEndpointUpdated: (newUrl: string) => void;
}

const EndpointConfig: React.FC<EndpointConfigProps> = ({ roomId, chatbotEndpointUrl, onEndpointUpdated }) => {
    const [url, setUrl] = useState(chatbotEndpointUrl || '');
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        setUrl(chatbotEndpointUrl || '');
    }, [chatbotEndpointUrl]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomId) return;
        setSaving(true);
        await fetch(`/api/rooms/${roomId}/endpoint`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatbot_endpoint_url: url }),
        });
        setSaving(false);
        onEndpointUpdated(url);
    };

    if (!roomId) return null;

    return (
        <form onSubmit={handleSave} className="flex mb-6 gap-2">
            <input
                className="flex-1 bg-gray-800 border-none rounded px-3 py-2 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="url"
                placeholder="Chatbot endpoint URL"
                value={url}
                onChange={e => setUrl(e.target.value)}
                disabled={saving}
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors text-sm font-semibold" type="submit">
                {saving ? 'Zapisywanie...' : 'Zapisz'}
            </button>
        </form>
    );
};

export default EndpointConfig; 