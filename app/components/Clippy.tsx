"use client";

import { useState, useEffect, useCallback } from "react";
import { useIdleDetection } from "@/app/hooks/useIdleDetection";
import { useWindowManager } from "@/app/contexts/WindowManagerContext";
import { collectContext } from "@/app/lib/clippyContext";

type ClippyProps = {
  manualTrigger?: boolean;
  onClose?: () => void;
};

export function Clippy({ manualTrigger = false, onClose }: ClippyProps) {
  const { isIdle, resetIdle } = useIdleDetection(30000); // 30 seconds
  const { windows } = useWindowManager();
  const [isVisible, setIsVisible] = useState(manualTrigger);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownIdle, setHasShownIdle] = useState(false);

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

        {/* Action Buttons */}
        {!isLoading && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => askClippy("Tell me what I can do here")}
              className="win98-button flex-1 px-3 py-1 text-xs"
            >
              💡 Tips
            </button>
            <button
              onClick={() => askClippy("I need help")}
              className="win98-button flex-1 px-3 py-1 text-xs"
            >
              ❓ Help
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
