"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
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

      if (!res.ok) {
        throw new Error(`API returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      
      if (data.error) {
        console.error("Clippy API error:", data.error);
        setResponse("Ugh, I crashed. Just like Internet Explorer. Have you tried turning me off and on again?");
      } else {
        setResponse(data.response || "Well? What do you want? I haven't got all day.");
      }
    } catch (error) {
      console.error("Failed to fetch Clippy response:", error);
      setResponse(
        "Connection failed. Must be that 56k modem acting up again. Try refreshing, genius."
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
    
    // Get selected text from active text area if any
    const activeElement = document.activeElement as HTMLTextAreaElement | HTMLInputElement;
    const selectedText = activeElement && 
      (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') &&
      activeElement.selectionStart !== activeElement.selectionEnd
        ? activeElement.value.substring(activeElement.selectionStart ?? 0, activeElement.selectionEnd ?? 0)
        : '';
    
    // Send to API first - it will determine if we need to open a browser
    setIsLoading(true);
    const context = collectContext(windows);

    try {
      const res = await fetch("/api/clippy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, prompt: userInput, selectedText }),
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      
      if (data.error) {
        console.error("Clippy API error:", data.error);
        setResponse("Ugh, I crashed. Just like Internet Explorer. Have you tried turning me off and on again?");
        return;
      }
      
      // Check if API wants us to open an app
      if (data.action === "openApp" && data.appId) {
        const appId = data.appId;
        const appMap: { [key: string]: () => Promise<any> } = {
          'internet-explorer': () => import("./apps/InternetExplorer"),
          'notepad': () => import("./apps/Notepad"),
          'paint': () => import("./apps/Paint"),
          'solitaire': () => import("./apps/Solitaire"),
          'minesweeper': () => import("./apps/Minesweeper"),
          'pinball': () => import("./apps/SpaceCadetPinball"),
          'chatroom': () => import("./apps/ChatRoom"),
          'my-computer': () => import("./apps/FileExplorer"),
        };
        
        if (appMap[appId]) {
          const module = await appMap[appId]();
          const Component = module[Object.keys(module)[0]];
          openWindow({
            title: data.app,
            component: Component,
            isMinimized: false,
            isMaximized: false,
            position: { x: 100 + Math.random() * 100, y: 80 + Math.random() * 80 },
            size: getWindowSize(appId as any),
            icon: data.icon,
          });
        }
        
        setResponse(data.response);
      }
      // Check if API wants us to insert text
      else if (data.action === "insertText" && data.text) {
        // Find active Notepad window
        const notepadWindow = windows.find((w) => w.title === "Notepad");
        
        if (notepadWindow) {
          // Dispatch event to insert text into Notepad
          window.dispatchEvent(
            new CustomEvent(`notepad-insert-${notepadWindow.id}`, {
              detail: { text: data.text, replaceSelection: data.replaceSelection },
            })
          );
        } else {
          // If no Notepad is open, open one and insert text
          const { Notepad } = await import("./apps/Notepad");
          const notepadId = openWindow({
            title: "Notepad",
            component: Notepad,
            isMinimized: false,
            isMaximized: false,
            position: { x: 150, y: 100 },
            size: getWindowSize('notepad'),
            icon: "📝",
          });
          
          // Wait a bit for the window to render, then insert text
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent(`notepad-insert-${notepadId}`, {
                detail: { text: data.text, replaceSelection: false },
              })
            );
          }, 100);
        }
        
        setResponse(data.response);
      }
      // Check if API wants us to open a browser
      else if (data.action === "browse" && data.url) {
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
        
        setResponse(data.response || `Fine, I'll open that in IE. Don't blame me when it crashes. 🌐`);
      } else {
        setResponse(data.response || "Well? What do you want? I haven't got all day.");
      }
    } catch (error) {
      console.error("Failed to fetch Clippy response:", error);
      setResponse(
        "Connection failed. Must be that 56k modem acting up again. Try refreshing, genius."
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
      className="fixed bottom-24 right-6 w-72 win98-raised shadow-lg z-50"
      style={{ background: 'var(--clippy-yellow)', maxWidth: "calc(100vw - 48px)" }}
    >
      {/* Title Bar */}
      <div className="win98-titlebar-active flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2">
          <Image
            src="/clippy.png"
            alt="Clippy"
            width={16}
            height={16}
            className="flex-shrink-0"
          />
          <span className="text-xs font-bold">Clippy</span>
        </div>
        <button
          onClick={handleClose}
          className="win98-button-xs"
          aria-label="Close Clippy"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Animated Clippy Character */}
          <div className="flex-shrink-0 animate-bounce">
            <Image
              src="/clippy.png"
              alt="Clippy"
              width={48}
              height={48}
            />
          </div>

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
                  "It looks like you're just clicking around aimlessly. Need help or just wasting my time?"}
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
              className="win98-button-sm flex-1 disabled:opacity-50"
            >
              Ask 💬
            </button>
            <button
              onClick={() => askClippy("Tell me what I can do here")}
              className="win98-button-sm"
            >
              💡 Tips
            </button>
          </div>
        )}
      </div>
    </div>
  );
}