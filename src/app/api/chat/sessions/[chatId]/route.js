import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; 
import clientPromise from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await params;
    if (!chatId) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('kisaan-mitra');
    
    const chat = await db.collection('chats').findOne({ 
      userId: session.user.id, 
      chatId 
    });

    return NextResponse.json({ 
      chatId: chatId,
      history: chat?.history || [],
      title: chat?.title || "New Chat"
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Single Session Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}