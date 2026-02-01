"use client";

import { useEffect, useRef, useState } from "react";

type DoomProps = {
  id: string;
};

// Using simpler iframe approach with js-dos hosted version for better compatibility
export function Doom({ id }: DoomProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Pre-warm: check if DOOM WAD file exists
    fetch('/games/doom/DOOM1.WAD', { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          throw new Error('DOOM1.WAD not found');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('DOOM WAD check failed:', err);
        setError('DOOM game files not found');
        setIsLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div className="h-full w-full bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="mb-4 text-xl text-red-500">Error Loading DOOM</div>
          <div className="text-sm text-gray-400">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full w-full bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="mb-4 text-xl">Preparing DOOM...</div>
          <div className="text-sm text-gray-400">Checking game files</div>
        </div>
      </div>
    );
  }

  // Use the well-tested DOOM WASM port with iframe for maximum compatibility
  // This avoids complex js-dos integration issues and provides better performance
  return (
    <div className="h-full w-full bg-black overflow-hidden">
      <iframe
        src="https://diekmann.github.io/wasm-fizzbuzz/doom/"
        className="w-full h-full border-0 block"
        title="DOOM"
        style={{ 
          margin: 0, 
          padding: 0,
          minWidth: '100%',
          minHeight: '100%',
          backgroundColor: '#000'
        }}
        allow="autoplay; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      />
    </div>
  );
}
