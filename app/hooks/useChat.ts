"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import PartySocket from "partysocket";
import type { Message } from "@/app/types/chat";

const MAX_MESSAGES = 100; // Limit message history

// Use environment variable for PartyKit host, fallback to localhost for development
const PARTYKIT_HOST = process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [username, setUsername] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<PartySocket | null>(null);

  useEffect(() => {
    // Connect to PartyKit chatroom
    const newSocket = new PartySocket({
      host: PARTYKIT_HOST,
      room: "global-chat",
    });
    
    socketRef.current = newSocket;

    newSocket.addEventListener("open", () => {
      console.log("Connected to chat server");
      setConnected(true);
    });

    newSocket.addEventListener("close", () => {
      console.log("Disconnected from chat server");
      setConnected(false);
    });

    newSocket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "username-assigned":
            setUsername(data.username);
            break;

          case "user-joined":
            setMessages((prev) => {
              const newMessages = [
                ...prev,
                {
                  username: "System",
                  text: `${data.username} joined the chat`,
                  timestamp: Date.now(),
                  type: "system" as const,
                },
              ];
              return newMessages.slice(-MAX_MESSAGES);
            });
            break;

          case "message":
            setMessages((prev) => {
              const newMessages = [...prev, data as Message];
              return newMessages.slice(-MAX_MESSAGES);
            });
            break;

          case "user-left":
            setMessages((prev) => {
              const newMessages = [
                ...prev,
                {
                  username: "System",
                  text: `${data.username} left the chat`,
                  timestamp: Date.now(),
                  type: "system" as const,
                },
              ];
              return newMessages.slice(-MAX_MESSAGES);
            });
            break;

          case "user-list":
            setUsers(data.users);
            break;

          default:
            console.warn("Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    });

    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (socketRef.current && connected) {
      socketRef.current.send(text);
    }
  }, [connected]);

  return { messages, users, username, connected, sendMessage };
}
