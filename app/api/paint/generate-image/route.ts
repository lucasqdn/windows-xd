import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Simple rate limiting (in-memory) - stricter for image generation
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per 5 minutes (images are expensive)
const RATE_WINDOW = 300000; // 5 minutes in ms

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
  let genAI: GoogleGenAI | null = null;
  
  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Image generation is limited to 20 requests per 5 minutes. Please try again later." },
        { status: 429 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt" },
        { status: 400 }
      );
    }

    // Validate prompt length
    if (prompt.length < 3) {
      return NextResponse.json(
        { error: "Prompt too short. Please provide a more detailed description." },
        { status: 400 }
      );
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: "Prompt too long. Please keep it under 1000 characters." },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add GEMINI_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    console.log("[AI Image] Generating image with prompt:", prompt.substring(0, 100) + "...");
    console.log("[AI Image] Using model: gemini-2.5-flash-image");
    console.log("[AI Image] API key:", process.env.GEMINI_API_KEY?.substring(0, 20) + "...");

    // Initialize client here to catch initialization errors
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Use Interactions API with gemini-2.5-flash-image
    const interaction = await genAI.interactions.create({
      model: "gemini-2.5-flash-image",
      input: `Generate an image: ${prompt}`,
      response_modalities: ["image"],
    });

    console.log("[AI Image] Interaction response received");
    console.log("[AI Image] Outputs:", interaction.outputs?.length || 0);

    // Extract image from outputs
    if (!interaction.outputs || interaction.outputs.length === 0) {
      console.error("[AI Image] No outputs in response");
      return NextResponse.json(
        { error: "Failed to generate image. No outputs received." },
        { status: 500 }
      );
    }

    // Find image output
    let imageOutput: any = null;
    for (const output of interaction.outputs) {
      console.log("[AI Image] Output type:", output.type);
      if (output.type === "image") {
        imageOutput = output;
        break;
      }
    }

    if (!imageOutput || !imageOutput.data) {
      console.error("[AI Image] No image output found");
      console.error("[AI Image] Available outputs:", interaction.outputs.map((o: any) => o.type));
      return NextResponse.json(
        { error: "Failed to generate image. No image in response." },
        { status: 500 }
      );
    }

    console.log("[AI Image] Image generated successfully!");
    console.log("[AI Image] Image mime_type:", imageOutput.mime_type);
    
    return NextResponse.json({ 
      imageData: imageOutput.data, // Base64 encoded image
      mimeType: imageOutput.mime_type || "image/png",
    });
  } catch (error: any) {
    console.error("[AI Image] Generation failed:", error);
    console.error("[AI Image] Error name:", error?.name);
    console.error("[AI Image] Error message:", error?.message);
    console.error("[AI Image] Error details:", error?.details || error?.response?.data);
    if (error?.stack) {
      console.error("[AI Image] Error stack:", error.stack.split('\n').slice(0, 5).join('\n'));
    }
    
    // Handle specific error types
    if (error?.message?.includes("quota") || error?.message?.includes("RESOURCE_EXHAUSTED")) {
      return NextResponse.json(
        { error: "API quota exceeded. Please try again later." },
        { status: 429 }
      );
    }
    
    if (error?.message?.includes("safety") || error?.message?.includes("policy") || error?.message?.includes("SAFETY")) {
      return NextResponse.json(
        { error: "Your prompt was blocked by safety filters. Please try a different description." },
        { status: 400 }
      );
    }

    if (error?.message?.includes("API key") || error?.message?.includes("authentication") || error?.message?.includes("UNAUTHENTICATED") || error?.message?.includes("invalid")) {
      return NextResponse.json(
        { error: "API authentication failed. Please check your API key configuration. Make sure your key has access to Gemini image generation models." },
        { status: 500 }
      );
    }

    if (error?.message?.includes("not found") || error?.message?.includes("model") || error?.message?.includes("NOT_FOUND") || error?.message?.includes("PERMISSION_DENIED")) {
      return NextResponse.json(
        { error: "Image generation model not available. Your API key may not have access to gemini-2.5-flash-image or Interactions API. This feature requires a Google AI Studio key with image generation enabled, or a Vertex AI setup with billing." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: `Failed to generate image: ${error?.message || "Unknown error"}. Check server logs for details.` },
      { status: 500 }
    );
  }
}
