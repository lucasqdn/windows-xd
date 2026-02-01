"use client";

import { useState } from "react";

type DoomProps = {
  id: string;
};

export function Doom({ id }: DoomProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Use dos.zone which provides clean, embedded DOOM without debug UI
  // This is a community-maintained DOS game portal with clean embeds
  return (
    <div className="h-full w-full bg-black overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-white z-10 bg-black">
          <div className="text-center">
            <div className="mb-4 text-xl">Loading DOOM...</div>
            <div className="text-sm text-gray-400 max-w-md px-4">
              <p className="mb-2">Controls:</p>
              <p className="text-xs">
                Arrow keys = Move • Ctrl = Shoot • Space = Open doors<br/>
                Alt+Arrows = Strafe • Enter = Start game
              </p>
            </div>
          </div>
        </div>
      )}
      
      <iframe
        src="https://dos.zone/doom-1993/"
        className="w-full h-full border-0 block"
        title="DOOM"
        style={{ 
          margin: 0, 
          padding: 0,
          minWidth: '100%',
          minHeight: '100%',
          backgroundColor: '#000'
        }}
        allow="autoplay; fullscreen; gamepad; pointer-lock"
        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
