"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { Message } from "@/app/types/chat";

const MAX_MESSAGES = 100; // Limit message history

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [username, setUsername] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from chat server");
      setConnected(false);
    });

    newSocket.on("user-joined", ({ username: joinedUser }: { username: string }) => {
      setMessages((prev) => {
        const newMessages = [
          ...prev,
          {
            username: "System",
            text: `${joinedUser} joined the chat`,
            timestamp: Date.now(),
            type: "system" as const,
          },
        ];
        // Limit to MAX_MESSAGES
        return newMessages.slice(-MAX_MESSAGES);
      });
      // Set username if this is us joining (only once)
      setUsername((prevUsername) => prevUsername || joinedUser);
    });

    newSocket.on("message", (msg: Message) => {
      setMessages((prev) => {
        const newMessages = [...prev, msg];
        // Limit to MAX_MESSAGES
        return newMessages.slice(-MAX_MESSAGES);
      });
    });

    newSocket.on("user-left", ({ username: leftUser }: { username: string }) => {
      setMessages((prev) => {
        const newMessages = [
          ...prev,
          {
            username: "System",
            text: `${leftUser} left the chat`,
            timestamp: Date.now(),
            type: "system" as const,
          },
        ];
        // Limit to MAX_MESSAGES
        return newMessages.slice(-MAX_MESSAGES);
      });
    });

    newSocket.on("user-list", (userList: string[]) => {
      setUsers(userList);
    });

    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("message", text);
    }
  }, [connected]);

  return { messages, users, username, connected, sendMessage };
}
