import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { startNewChat, sendMessage } from '@/lib/gemini';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message, chatId } = body;

    if (!message || !chatId) {
      return NextResponse.json({ error: "Message and chatId are required" }, { status: 400 });
    }

    const userId = session.user.id;
    const client = await clientPromise;
    const db = client.db('kisaan-mitra');
    const chatsCollection = db.collection('chats');

    // 1. Fetch existing chat
    const chatDoc = await chatsCollection.findOne({ userId, chatId });
    const existingHistory = chatDoc?.history || [];

    // 2. Talk to Gemini
    const chatSession = startNewChat(existingHistory);
    const aiReply = await sendMessage(chatSession, message);

    // 3. Update history array
    const updatedHistory = [
      ...existingHistory,
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: aiReply }] }
    ];

    // 4. Generate a clean title for new chats
    const chatTitle = chatDoc?.title || (message.substring(0, 30) + (message.length > 30 ? "..." : ""));

    // 5. Save to MongoDB
    await chatsCollection.updateOne(
      { userId, chatId },
      { 
        $set: { 
          history: updatedHistory,
          updatedAt: new Date(),
          title: chatTitle
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ reply: aiReply }, { status: 200 });
  } catch (error) {
    console.error("Chat POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}