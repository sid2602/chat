import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET /api/rooms - List all rooms
export async function GET(req: NextRequest) {
  try {
    const rooms = db.prepare('SELECT id, name, chatbot_endpoint_url FROM rooms').all();
    return NextResponse.json({ rooms });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

// POST /api/rooms - Create a new room
export async function POST(req: NextRequest) {
  try {
    const { name, chatbot_endpoint_url } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 });
    }
    const stmt = db.prepare('INSERT INTO rooms (name, chatbot_endpoint_url) VALUES (?, ?)');
    const info = stmt.run(name, chatbot_endpoint_url || null);
    const room = db.prepare('SELECT id, name, chatbot_endpoint_url FROM rooms WHERE id = ?').get(info.lastInsertRowid);
    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
} 