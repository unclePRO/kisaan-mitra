import { NextResponse } from 'next/server';

// This handles the POST request when Dev 3's frontend sends a message
export async function POST(request) {
  try {
    // 1. Get the data the frontend sent
    const body = await request.json();
    const userMessage = body.message; 
    
    // Check if message exists
    if (!userMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 2. TODO FOR DEV 1: Call Google Gemini API here
    // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    // const result = await model.generateContent(userMessage);
    // const aiResponse = result.response.text();

    // DUMMY RESPONSE FOR NOW (So Dev 3 can test their frontend without breaking things)
    const dummyResponse = `I am your Kisaan Mitra AI. You asked about: "${userMessage}". (Gemini API not yet connected!)`;

    // 3. Send the answer back to the frontend
    return NextResponse.json({ 
      reply: dummyResponse 
    }, { status: 200 });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 });
  }
}