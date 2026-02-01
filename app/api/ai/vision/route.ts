import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

// Validation schema
const VisionRequestSchema = z.object({
  image: z.string().min(1, "Image data is required"),
  prompt: z.string().min(1, "Prompt is required"),
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = VisionRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { image, prompt } = validation.data;

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API key not configured",
          html: "<div style='padding: 20px; font-family: Arial;'><h1>⚠️ Configuration Error</h1><p>OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.</p></div>",
        },
        { status: 500 }
      );
    }

    // Call OpenAI Vision API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert Frontend Engineer. Your job is to look at the wireframe sketch provided by the user and output clean, responsive HTML/Tailwind CSS code that replicates the layout. Return ONLY the raw HTML string, no markdown formatting, no code blocks, no explanations. The HTML should be complete and ready to render.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
    });

    const generatedHtml = completion.choices[0]?.message?.content || "";

    // Clean up markdown code blocks if present
    let cleanHtml = generatedHtml
      .replace(/```html\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return NextResponse.json({
      html: cleanHtml,
      usage: completion.usage,
    });
  } catch (error: unknown) {
    console.error("Vision API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to generate code from image",
        details: errorMessage,
        html: "<div style='padding: 20px; font-family: Arial;'><h1>❌ Error</h1><p>My brain hurts! I couldn't process that drawing. Please try again.</p></div>",
      },
      { status: 500 }
    );
  }
}
