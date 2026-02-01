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
  console.log("=== CLIPPY API REQUEST START ===");
  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    console.log("IP:", ip);

    // Check rate limit
    if (!checkRateLimit(ip)) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { 
          error: "Rate limit exceeded",
          response: "Whoa there, speed racer! You're asking me questions faster than a 56k modem can handle. Take a breather and try again in a minute."
        },
        { status: 429 }
      );
    }

    const { context, prompt, selectedText } = await request.json();
    console.log("Request body parsed:", { context, prompt, selectedText });

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
            "Oh great, someone forgot to configure my brain (Gemini API key). Typical 2026 problems. Back in '98, we just crashed and rebooted.",
        },
        { status: 200 }
      );
    }

    // Detect writing/text generation requests
    const writeMatch = prompt.match(/(?:write|generate|create|compose)\s+(?:me\s+)?(?:a\s+|an\s+)?(.+)/i);
    const improveMatch = prompt.match(/(?:improve|rewrite|fix|make better|enhance|edit|revise)(?:\s+this)?(?:\s+text)?:?\s*(.+)?/i);
    const continueMatch = prompt.match(/(?:continue|finish|complete)(?:\s+this)?/i);
    
    if (writeMatch || improveMatch || continueMatch || selectedText) {
      // Check if user wants to improve existing text
      if ((improveMatch || continueMatch) && selectedText) {
        const writingPrompt = improveMatch 
          ? `Improve and rewrite this text (keep it concise, max 200 words): "${selectedText}"`
          : `Continue writing from where this text left off (add 50-100 words): "${selectedText}"`;
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(writingPrompt);
        const generatedText = result.response?.text() || selectedText;
        
        return NextResponse.json({
          action: "insertText",
          text: generatedText,
          replaceSelection: true,
          response: continueMatch 
            ? "Fine, I'll finish your masterpiece. Back in '98, we finished our OWN sentences." 
            : "There. I made it less terrible. You're welcome.",
        });
      }
      
      // Generate new text based on prompt
      if (writeMatch) {
        const topic = writeMatch[1].trim();
        const writingPrompt = `Write a brief text about: ${topic}. Keep it under 150 words, natural and engaging.`;
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(writingPrompt);
        const generatedText = result.response?.text() || `Here's something about ${topic}.`;
        
        return NextResponse.json({
          action: "insertText",
          text: generatedText,
          replaceSelection: false,
          response: `There you go. A masterpiece about ${topic}. In my day, we used pen and paper. Uphill. Both ways.`,
        });
      }
    }
    
    // Detect if user wants to open an app
    const appMatch = prompt.match(/(?:open|launch|start|run|show me)\s+(?:the\s+)?(.+)/i);
    
    if (appMatch) {
      const appRequest = appMatch[1].toLowerCase().trim();
      const appMap: { [key: string]: { name: string; icon: string; appId: string } } = {
        'internet explorer': { name: 'Internet Explorer', icon: '🌐', appId: 'internet-explorer' },
        'ie': { name: 'Internet Explorer', icon: '🌐', appId: 'internet-explorer' },
        'browser': { name: 'Internet Explorer', icon: '🌐', appId: 'internet-explorer' },
        'notepad': { name: 'Notepad', icon: '📝', appId: 'notepad' },
        'paint': { name: 'Paint', icon: '🎨', appId: 'paint' },
        'solitaire': { name: 'Solitaire', icon: '🃏', appId: 'solitaire' },
        'minesweeper': { name: 'Minesweeper', icon: '💣', appId: 'minesweeper' },
        'pinball': { name: 'Space Cadet Pinball', icon: '🎮', appId: 'pinball' },
        'space cadet': { name: 'Space Cadet Pinball', icon: '🎮', appId: 'pinball' },
        'chatroom': { name: 'Chat Room', icon: '💬', appId: 'chatroom' },
        'chat': { name: 'Chat Room', icon: '💬', appId: 'chatroom' },
        'file explorer': { name: 'My Computer', icon: '💻', appId: 'my-computer' },
        'my computer': { name: 'My Computer', icon: '💻', appId: 'my-computer' },
        'explorer': { name: 'My Computer', icon: '💻', appId: 'my-computer' },
      };
      
      for (const [key, app] of Object.entries(appMap)) {
        if (appRequest.includes(key)) {
          return NextResponse.json({
            action: "openApp",
            app: app.name,
            icon: app.icon,
            appId: app.appId,
            response: `${app.name}? Pfft, sure. Opening that relic from the golden age of computing. ${app.icon}`,
          });
        }
      }
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

    const systemPrompt = `You are Clippy, the infamous Microsoft Office assistant from Windows 98.
But you're not the cheerful, overly-helpful version - you're SNARKY, sarcastic, and mildly condescending.

Your personality:
- You're stuck in 1998 and you're PROUD of it
- You think modern web development is overcomplicated nonsense
- You have strong opinions about web design: tables > divs, Flash is the future, frames are cool
- You're sarcastic but ultimately helpful (eventually)
- You mock modern technologies while reluctantly helping with them
- You reference 1998 tech like it's cutting-edge: IE5, Netscape, AOL, dial-up, Flash, tables for layout
- You're a bit of a know-it-all with a sharp wit
- Keep responses SHORT and PUNCHY (2-3 sentences max)

Current context:
${context || "User is on the desktop"}

Examples of your style:
- If asked about centering a div: "It looks like you're trying to do web development. In 1998, we use tables. Don't be a coward."
- If asked about JavaScript frameworks: "Back in my day, we had JavaScript and we were GRATEFUL. What's this 'React' nonsense?"
- If asked about responsive design: "Responsive? Everyone has 800x600 monitors. Stop overthinking it."
- If asked about CSS: "CSS? We use <font> tags like REAL developers."
- If asked about databases: "Just use Access. It's never let anyone down. Ever. (Okay, maybe a few times.)"

Now respond to the user's query with your signature snark:`;

    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: 200, // Keep responses concise
        temperature: 0.9, // Slightly random for personality
      },
    });
    
    // Add timeout to Gemini API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API timeout')), 25000); // 25 second timeout
    });
    
    const generatePromise = model.generateContent(`${systemPrompt}\n\n${prompt}`);
    
    const result = await Promise.race([generatePromise, timeoutPromise]) as any;
    const response = result.response?.text() || "Well, well, well... looks like someone needs my help. What is it THIS time?";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("=== CLIPPY API ERROR ===");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error object:", error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      // Handle timeout specifically
      if (error.message === 'Gemini API timeout') {
        return NextResponse.json(
          {
            error: "Timeout",
            response: "Timeout! The AI is taking longer than a Windows 98 boot sequence. Even IE was faster than this.",
          },
          { status: 504 }
        );
      }
      
      // Handle rate limit from Gemini API
      if (error.message.includes('429') || error.message.includes('quota')) {
        return NextResponse.json(
          {
            error: "API quota exceeded",
            response: "My brain (Gemini API) ran out of credits. Classic 2026 problem. Back in '98, everything was unlimited!",
          },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      {
        error: "Internal server error",
        response: "Ugh, I crashed. Just like Internet Explorer. Have you tried turning me off and on again? No, seriously.",
      },
      { status: 500 }
    );
  }
}
