import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; 
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('kisaan-mitra');
    
    // Find all chats for this user, sorted by newest
    const chats = await db.collection('chats')
      .find({ userId: session.user.id })
      .project({ chatId: 1, title: 1, updatedAt: 1 })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json(chats || []);
  } catch (error) {
    console.error("Sessions GET Error:", error);
    // Returning an empty array instead of a 500 prevents the frontend map() from crashing
    return NextResponse.json([], { status: 200 });
  }
}