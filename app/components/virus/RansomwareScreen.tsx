"use client";

import { useState, useEffect } from "react";
import { VIRUS_TIMING } from "@/app/lib/virus/types";

const FAKE_FILES = [
  "C:\\Documents\\Passwords.txt",
  "C:\\Documents\\Bank_Info.xlsx",
  "C:\\Photos\\Vacation_2023.jpg",
  "C:\\Work\\Project_Files.docx",
  "C:\\Desktop\\Secret_Stuff.zip",
  "C:\\Downloads\\Important_Document.pdf",
  "C:\\Music\\Favorite_Songs.mp3",
  "C:\\Videos\\Family_Memories.mp4",
  "C:\\Documents\\Tax_Returns_2023.pdf",
  "C:\\Work\\Client_Database.xlsx",
];

export function RansomwareScreen() {
  const [timeRemaining, setTimeRemaining] = useState(
    VIRUS_TIMING.ransomwareCountdown
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-red-900 flex items-center justify-center z-[10000] p-8">
      <div className="bg-black text-white max-w-4xl w-full border-4 border-red-600 p-8 rounded-lg shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">🔒</div>
          <h1 className="text-4xl font-bold mb-2 text-red-500">
            YOUR FILES HAVE BEEN ENCRYPTED!
          </h1>
          <p className="text-xl text-gray-300">
            All your important files have been locked
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-red-950 border-2 border-red-600 p-6 mb-6 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Time until files are permanently deleted:</p>
              <p className="text-5xl font-mono font-bold text-red-500">
                {formatTime(timeRemaining)}
              </p>
            </div>
            <div className="text-6xl animate-pulse">⏰</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-900 border border-gray-700 p-6 mb-6 rounded">
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">
            What happened to my computer?
          </h2>
          <p className="mb-4 text-gray-300">
            Your files have been encrypted with military-grade encryption. To
            decrypt your files, you must pay 0.5 BTC (Bitcoin).
          </p>
          <div className="bg-black border border-gray-700 p-4 rounded">
            <p className="text-sm text-gray-500 mb-2">Send payment to:</p>
            <p className="font-mono text-green-500 break-all">
              1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
            </p>
          </div>
        </div>

        {/* Encrypted Files List */}
        <div className="bg-gray-900 border border-gray-700 p-4 rounded mb-6">
          <h3 className="text-lg font-bold mb-3 text-red-400">
            Encrypted Files:
          </h3>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {FAKE_FILES.map((file, index) => (
              <div
                key={index}
                className="text-sm font-mono text-gray-400 flex items-center gap-2"
              >
                <span className="text-red-500">🔒</span>
                {file}
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-900 border border-yellow-600 p-4 rounded mb-6">
          <p className="text-yellow-200 text-center font-bold">
            ⚠️ DO NOT attempt to recover files yourself or contact authorities.
            This will result in permanent data loss! ⚠️
          </p>
        </div>

        {/* Disclaimer (small) */}
        <div className="text-center text-xs text-gray-600 border-t border-gray-800 pt-4">
          <p>
            (This is a harmless browser simulation - no files are actually
            encrypted)
          </p>
          <p className="mt-1">Reload the page to exit this prank</p>
        </div>
      </div>
    </div>
  );
}
