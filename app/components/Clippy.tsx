"use client";

import { useState, useEffect, useCallback } from "react";
import { useIdleDetection } from "@/app/hooks/useIdleDetection";
import { useWindowManager } from "@/app/contexts/WindowManagerContext";
import { collectContext } from "@/app/lib/clippyContext";
import { getWindowSize } from "@/app/config/windowSizes";

type ClippyProps = {
  manualTrigger?: boolean;
  onClose?: () => void;
};

export function Clippy({ manualTrigger = false, onClose }: ClippyProps) {
  const { isIdle, resetIdle } = useIdleDetection(30000); // 30 seconds
  const { windows, openWindow } = useWindowManager();
  const [isVisible, setIsVisible] = useState(manualTrigger);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownIdle, setHasShownIdle] = useState(false);
  const [userInput, setUserInput] = useState("");

  const askClippy = useCallback(async (prompt: string) => {
    setIsLoading(true);
    const context = collectContext(windows);

    try {
      const res = await fetch("/api/clippy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, prompt }),
      });

      const data = await res.json();
      setResponse(data.response || "Hi! How can I help you today?");
    } catch (error) {
      console.error("Failed to fetch Clippy response:", error);
      setResponse(
        "Hi! I'm having trouble connecting right now, but I'm here to help!"
      );
    } finally {
      setIsLoading(false);
    }
  }, [windows]);

  useEffect(() => {
    // Show on manual trigger
    if (manualTrigger) {
      setIsVisible(true);
      askClippy("User needs help");
    }
  }, [manualTrigger, askClippy]);

  useEffect(() => {
    // Show when user is idle (but only once per session)
    if (isIdle && !isVisible && !hasShownIdle) {
      setIsVisible(true);
      setHasShownIdle(true);
      askClippy("User seems idle");
    }
  }, [isIdle, isVisible, hasShownIdle, askClippy]);

  const handleAskQuestion = async () => {
    if (!userInput.trim()) return;
    
    // Send to API first - it will determine if we need to open a browser
    setIsLoading(true);
    const context = collectContext(windows);

    try {
      const res = await fetch("/api/clippy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, prompt: userInput }),
      });

      const data = await res.json();
      
      // Check if API wants us to open a browser
      if (data.action === "browse" && data.url) {
        // Find or open Internet Explorer
        let ieWindow = windows.find((w) => w.title.includes("Internet Explorer"));
        let ieId = ieWindow?.id;
        
        if (!ieWindow) {
          const { InternetExplorer } = await import("./apps/InternetExplorer");
          ieId = openWindow({
            title: "Internet Explorer",
            component: InternetExplorer,
            isMinimized: false,
            isMaximized: false,
            position: { x: 150, y: 100 },
            size: getWindowSize('internet-explorer'),
            icon: "🌐",
          });
        }
        
        // Navigate to the URL
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent(`ie-navigate-${ieId}`, { detail: data.url })
          );
        }, 100);
        
        setResponse(data.response || `Opening that in Internet Explorer for you! 🌐`);
      } else {
        setResponse(data.response || "Hi! How can I help you today?");
      }
    } catch (error) {
      console.error("Failed to fetch Clippy response:", error);
      setResponse(
        "Hi! I'm having trouble connecting right now, but I'm here to help!"
      );
    } finally {
      setIsLoading(false);
    }
    
    setUserInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    resetIdle();
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-24 right-6 w-72 bg-[#ffffcc] win98-raised shadow-lg z-50"
      style={{ maxWidth: "calc(100vw - 48px)" }}
    >
      {/* Title Bar */}
      <div className="win98-titlebar-active flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📎</span>
          <span className="text-xs font-bold">Clippy</span>
        </div>
        <button
          onClick={handleClose}
          className="win98-button px-2 py-0 text-xs leading-none"
          aria-label="Close Clippy"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Animated Clippy Character */}
          <div className="text-5xl flex-shrink-0 animate-bounce">📎</div>

          {/* Message */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-pulse">Thinking...</div>
                <div className="flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
                    .
                  </span>
                  <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
                    .
                  </span>
                  <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
                    .
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed">
                {response ||
                  "Hi! It looks like you might need help. What can I do for you?"}
              </p>
            )}
          </div>
        </div>

        {/* Input Area */}
        {!isLoading && (
          <div className="mt-4">
            <div className="win98-inset bg-white p-1">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="w-full px-1 py-0.5 text-xs outline-none"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isLoading && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleAskQuestion}
              disabled={!userInput.trim()}
              className="win98-button flex-1 px-3 py-1 text-xs disabled:opacity-50"
            >
              Ask 💬
            </button>
            <button
              onClick={() => askClippy("Tell me what I can do here")}
              className="win98-button px-3 py-1 text-xs"
            >
              💡 Tips
            </button>
          </div>
        )}
      </div>
    </div>
  );
}