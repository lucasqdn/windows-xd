import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Simple rate limiting (in-memory)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60000; // 1 minute in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const { context, prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          response:
            "Hi! It looks like you might need help. (Note: Gemini API key not configured - using fallback response)",
        },
        { status: 200 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are Clippy, the helpful Microsoft Office assistant from Windows 98. 
You are cheerful, slightly enthusiastic, and always eager to help.

Current context:
${context || "User is on the desktop"}

Provide brief, helpful assistance (2-3 sentences max). Stay in character as Clippy.
Be encouraging and helpful, but keep responses concise.`;

    const result = await model.generateContent([systemPrompt, prompt]);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Clippy API error:", error);
    return NextResponse.json(
      {
        response:
          "Hi! I'm having a little trouble right now, but I'm here to help! Could you try asking me again?",
      },
      { status: 200 }
    );
  }
}
