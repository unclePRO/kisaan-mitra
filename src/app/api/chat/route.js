import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { startNewChat, sendMessage } from '@/lib/gemini';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { message, chatId, image } = body; 

    if (!message || !chatId) {
      return NextResponse.json({ error: "Message and chatId are required" }, { status: 400 });
    }

    const userId = session.user.id;
    const client = await clientPromise;
    const db = client.db('kisaan-mitra');
    const chatsCollection = db.collection('chats');

    const chatDoc = await chatsCollection.findOne({ userId, chatId });
    const existingHistory = chatDoc?.history || [];

    const chatSession = startNewChat(existingHistory);
    
    // Pass the image directly if it exists, otherwise null
    const aiReply = await sendMessage(
      chatSession, 
      message, 
      image?.base64 || null, 
      image?.mimeType || "image/jpeg"
    );

    // Standardize history for DB
    const userHistoryPart = image 
      ? { role: 'user', parts: [{ text: `[Image Uploaded] ${message}` }] }
      : { role: 'user', parts: [{ text: message }] };

    const updatedHistory = [
      ...existingHistory,
      userHistoryPart,
      { role: 'model', parts: [{ text: aiReply }] }
    ];

    const chatTitle = chatDoc?.title || (message.substring(0, 30) + (message.length > 30 ? "..." : ""));

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
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}