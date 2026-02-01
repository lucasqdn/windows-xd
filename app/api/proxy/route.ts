import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache to prevent duplicate requests
const cache = new Map<string, { html: string; timestamp: number }>();
const CACHE_DURATION = 5000; // 5 seconds

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  // Check cache first
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return new NextResponse(cached.html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "X-Frame-Options": "ALLOWALL",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    const contentType = response.headers.get("content-type") || "";
    
    // Handle different content types
    if (contentType.includes("text/html")) {
      const html = await response.text();
      
      // Cache the response
      cache.set(url, { html, timestamp: Date.now() });
      
      // Clean old cache entries (keep only last 50)
      if (cache.size > 50) {
        const firstKey = cache.keys().next().value;
        if (typeof firstKey === "string") {
          cache.delete(firstKey);
        }
      }
      
      // Return HTML without modification to prevent interference with dynamic content
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "X-Frame-Options": "ALLOWALL",
        },
      });
    } else if (contentType.includes("image/") || contentType.includes("application/") || contentType.includes("text/css") || contentType.includes("text/javascript")) {
      // Pass through other content types (images, CSS, JS, etc.)
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
        },
      });
    } else {
      const text = await response.text();
      return new NextResponse(text, {
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse(
      `<html>
        <head>
          <style>
            body { font-family: 'MS Sans Serif', Arial; padding: 20px; background: #c0c0c0; }
            .error-box { background: white; border: 2px solid #808080; padding: 20px; }
            h1 { font-size: 16px; margin: 0 0 10px 0; }
            p { font-size: 12px; margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="error-box">
            <h1>⚠️ Internet Explorer Cannot Display the Webpage</h1>
            <p><strong>Most likely causes:</strong></p>
            <ul>
              <li>You are not connected to the Internet.</li>
              <li>The website is experiencing problems.</li>
              <li>There might be a typing error in the address.</li>
            </ul>
            <p><strong>URL:</strong> ${url}</p>
            <hr>
            <p><small>Internet Explorer 6.0</small></p>
          </div>
        </body>
      </html>`,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  }
}
