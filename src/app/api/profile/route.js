import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from '@/lib/mongodb';

// FETCH PROFILE DATA
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db('kisaan-mitra');
    
    const user = await db.collection('users').findOne({ email: session.user.email });
    
    if (user) {
      return NextResponse.json({ profile: user }, { status: 200 });
    } else {
      return NextResponse.json({ profile: null }, { status: 200 });
    }
  } catch (error) {
    console.error("Fetch Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// SAVE PROFILE DATA
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('kisaan-mitra');
    
    await db.collection('users').updateOne(
      { email: session.user.email },
      { $set: { 
          address: body.address,
          age: body.age,
          state: body.state,
          district: body.district,
          coordinates: body.coordinates,
          phone: body.phone,
          avatarBase64: body.avatar 
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Save Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}