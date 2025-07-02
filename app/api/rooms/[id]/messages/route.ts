import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET /api/rooms/[id]/messages - Get messages for a room
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const roomId = Number(params.id);
    if (isNaN(roomId)) {
      return NextResponse.json({ error: 'Invalid room id' }, { status: 400 });
    }
    const messages = db.prepare('SELECT id, room_id, sender_type, content, timestamp FROM messages WHERE room_id = ? ORDER BY timestamp ASC').all(roomId);
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST /api/rooms/[id]/messages - Send a message in a room
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const roomId = Number(params.id);
    if (isNaN(roomId)) {
      return NextResponse.json({ error: 'Invalid room id' }, { status: 400 });
    }
    const { sender_type, content } = await req.json();
    if (!sender_type || !content) {
      return NextResponse.json({ error: 'sender_type and content are required' }, { status: 400 });
    }
    const stmt = db.prepare('INSERT INTO messages (room_id, sender_type, content) VALUES (?, ?, ?)');
    const info = stmt.run(roomId, sender_type, content);
    const message = db.prepare('SELECT id, room_id, sender_type, content, timestamp FROM messages WHERE id = ?').get(info.lastInsertRowid);
    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
} 