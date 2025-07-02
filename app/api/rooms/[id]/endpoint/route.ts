import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

// PATCH /api/rooms/[id]/endpoint - Update chatbot endpoint URL for a room
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const roomId = Number(params.id);
    if (isNaN(roomId)) {
      return NextResponse.json({ error: 'Invalid room id' }, { status: 400 });
    }
    const { chatbot_endpoint_url } = await req.json();
    if (!chatbot_endpoint_url) {
      return NextResponse.json({ error: 'chatbot_endpoint_url is required' }, { status: 400 });
    }
    db.prepare('UPDATE rooms SET chatbot_endpoint_url = ? WHERE id = ?').run(chatbot_endpoint_url, roomId);
    const room = db.prepare('SELECT id, name, chatbot_endpoint_url FROM rooms WHERE id = ?').get(roomId);
    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update endpoint' }, { status: 500 });
  }
} 