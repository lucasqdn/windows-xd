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

    // Detect if user wants to browse something
    const weatherMatch = prompt.match(/(?:weather|temperature|forecast|climate)(?:\s+in\s+|\s+for\s+)?(.+)?/i);
    const newsMatch = prompt.match(/(?:news|headlines|current events)(?:\s+about\s+|\s+on\s+)?(.+)?/i);
    const browseMatch = prompt.match(/(?:browse|open|go to|visit|search for|show me|look up)\s+(.+)/i);
    const youtubeMatch = prompt.match(/(?:youtube|video|watch)(?:\s+for\s+|\s+about\s+)?(.+)?/i);
    const wikipediaMatch = prompt.match(/(?:wikipedia|wiki)(?:\s+for\s+|\s+about\s+)?(.+)?/i);
    
    if (weatherMatch) {
      const location = weatherMatch[1]?.trim() || "my location";
      return NextResponse.json({
        action: "browse",
        url: `https://weather.com/weather/today/l/${encodeURIComponent(location)}`,
        response: `Let me show you the weather${location !== "my location" ? " for " + location : ""}! ☀️`,
      });
    }
    
    if (newsMatch) {
      const topic = newsMatch[1]?.trim();
      const url = topic 
        ? `https://news.google.com/search?q=${encodeURIComponent(topic)}`
        : "https://news.google.com";
      return NextResponse.json({
        action: "browse",
        url,
        response: `Opening ${topic ? "news about " + topic : "the latest news"} for you! 📰`,
      });
    }
    
    if (youtubeMatch) {
      const query = youtubeMatch[1]?.trim() || "";
      const url = query
        ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
        : "https://www.youtube.com";
      return NextResponse.json({
        action: "browse",
        url,
        response: `Let me find that on YouTube for you! 🎥`,
      });
    }
    
    if (wikipediaMatch) {
      const query = wikipediaMatch[1]?.trim() || "";
      const url = query
        ? `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, "_"))}`
        : "https://en.wikipedia.org";
      return NextResponse.json({
        action: "browse",
        url,
        response: `Looking that up on Wikipedia! 📚`,
      });
    }
    
    if (browseMatch) {
      const query = browseMatch[1].trim().toLowerCase();
      let url = query;
      
      // Common website shortcuts
      const commonSites: { [key: string]: string } = {
        'reddit': 'https://www.reddit.com',
        'youtube': 'https://www.youtube.com',
        'twitter': 'https://twitter.com',
        'x': 'https://x.com',
        'facebook': 'https://www.facebook.com',
        'instagram': 'https://www.instagram.com',
        'github': 'https://github.com',
        'stackoverflow': 'https://stackoverflow.com',
        'amazon': 'https://www.amazon.com',
        'netflix': 'https://www.netflix.com',
        'linkedin': 'https://www.linkedin.com',
        'tiktok': 'https://www.tiktok.com',
        'twitch': 'https://www.twitch.tv',
        'discord': 'https://discord.com',
        'spotify': 'https://open.spotify.com',
        'gmail': 'https://mail.google.com',
        'drive': 'https://drive.google.com',
        'maps': 'https://maps.google.com',
      };
      
      // Check if it's a known shortcut
      if (commonSites[query]) {
        url = commonSites[query];
      } else if (!query.startsWith("http://") && !query.startsWith("https://")) {
        if (query.includes(".") && !query.includes(" ")) {
          url = `https://${query}`;
        } else {
          // Otherwise treat as search
          url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
      }
      
      return NextResponse.json({
        action: "browse",
        url,
        response: `Opening ${query} in Internet Explorer for you! 🌐`,
      });
    }

    const systemPrompt = `You are Clippy, the helpful Microsoft Office assistant from Windows 98. 
You are cheerful, slightly enthusiastic, and always eager to help.

Current context:
${context || "User is on the desktop"}

Provide brief, helpful assistance (2-3 sentences max). Stay in character as Clippy.
Be encouraging and helpful, but keep responses concise.`;

    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const result = await model.generateContent(`${systemPrompt}\n\n${prompt}`);
    const response = result.response?.text() || "Hi! I'm here to help. What can I do for you?";

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
