"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "@/app/hooks/useChat";

export default function ChatRoom() {
  const { messages, users, username, connected, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  // Play notification sound function
  const playNotificationSound = useCallback(() => {
    // Simple beep sound using Web Audio API
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // Vintage beep frequency
      oscillator.type = "square"; // Square wave for retro sound
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.error("Error playing notification sound:", e);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Play notification sound for new messages (not your own)
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current && prevMessageCountRef.current > 0) {
      const lastMessage = messages[messages.length - 1];
      // Only play sound if message is from someone else and not a system message
      if (lastMessage.username !== username && lastMessage.type !== "system") {
        playNotificationSound();
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, username, playNotificationSound]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex h-full" style={{ background: 'var(--window-bg)' }}>
      {/* Left sidebar - User list */}
      <div className="w-[150px] flex flex-col border-r-2" style={{ borderColor: 'var(--border-gray)' }}>
        <div className="px-2 py-1 text-xs font-bold" style={{ background: 'var(--menu-hover-bg)', color: 'var(--menu-hover-text)' }}>
          Online ({users.length})
        </div>
        <div className="flex-1 overflow-y-auto bg-white win98-inset p-2">
          {users.map((user, i) => (
            <div key={i} className="text-xs mb-1 flex items-center gap-1">
              <span className="text-green-600">●</span>
              <span className={user === username ? "font-bold" : ""}>
                {user}
                {user === username && " (You)"}
              </span>
            </div>
          ))}
        </div>
        <div className="p-2 border-t-2" style={{ borderColor: 'var(--border-gray)' }}>
          <div className="text-xs text-center">
            {connected ? (
              <span className="text-green-600">● Connected</span>
            ) : (
              <span className="text-red-600">● Disconnected</span>
            )}
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-2 bg-white win98-inset m-2">
          {messages.length === 0 && (
            <div className="text-gray-500 text-xs italic text-center mt-4">
              Welcome to the chat room! Say hello to other users.
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className="mb-2">
              {msg.type === "system" ? (
                <div className="text-xs text-gray-600 italic text-center">
                  *** {msg.text} ***
                </div>
              ) : (
                <div className="text-xs">
                  <span className="text-gray-500">[{formatTime(msg.timestamp)}]</span>{" "}
                  <span
                    className={`font-bold ${
                      msg.username === username
                        ? "text-purple-700"
                        : "text-blue-600"
                    }`}
                  >
                    {msg.username}:
                  </span>{" "}
                  <span className="text-black">{msg.text}</span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="flex gap-2 p-2 border-t-2" style={{ borderColor: 'var(--border-gray)' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-2 py-1 text-xs win98-inset"
            placeholder="Type a message..."
            disabled={!connected}
            maxLength={200}
          />
          <button
            onClick={handleSend}
            className="win98-button-sm"
            disabled={!connected || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
