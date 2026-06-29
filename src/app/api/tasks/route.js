import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db('kisaan-mitra');
    const tasks = await db.collection('tasks').find({ userId: session.user.id }).toArray();

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { text } = await request.json();
    const client = await clientPromise;
    const db = client.db('kisaan-mitra');
    
    const newTask = {
      userId: session.user.id,
      text,
      completed: false,
      createdAt: new Date()
    };
    
    const result = await db.collection('tasks').insertOne(newTask);
    return NextResponse.json({ ...newTask, _id: result.insertedId }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, completed } = await request.json();
    const client = await clientPromise;
    const db = client.db('kisaan-mitra');
    
    await db.collection('tasks').updateOne(
      { _id: new ObjectId(id), userId: session.user.id },
      { $set: { completed: !completed } }
    );
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}