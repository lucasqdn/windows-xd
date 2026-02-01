"use client";

import { useState, useEffect } from "react";

type DoomProps = {
  id: string;
};

export function Doom({ id }: DoomProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    // Hide loading after iframe loads
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleStartGame = () => {
    setShowOverlay(false);
  };

  return (
    <div className="h-full w-full bg-black overflow-hidden relative">
      {/* Overlay to hide the debug UI and article links */}
      {showOverlay && !isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center text-white z-10 bg-black cursor-pointer"
          onClick={handleStartGame}
        >
          <div className="text-center px-8 max-w-lg">
            <div className="mb-6">
              <div className="text-6xl mb-4">💀</div>
              <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'Impact, sans-serif' }}>
                DOOM
              </div>
              <div className="text-sm text-gray-400 mb-6">
                Shareware Version 1.9
              </div>
            </div>

            <div className="bg-[#c0c0c0] text-black p-4 mb-6 border-2 border-white" style={{ borderStyle: 'outset' }}>
              <div className="text-sm text-left space-y-2">
                <div className="font-bold mb-3">Controls:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>↑↓←→ Arrow Keys</div>
                  <div>Move & Turn</div>
                  <div>Ctrl</div>
                  <div>Fire Weapon</div>
                  <div>Space</div>
                  <div>Use/Open Doors</div>
                  <div>Alt + Arrows</div>
                  <div>Strafe</div>
                  <div>Enter</div>
                  <div>Confirm/Start</div>
                </div>
              </div>
            </div>

            <button
              className="win98-button px-8 py-3 text-lg font-bold"
              onClick={handleStartGame}
            >
              Click to Start Game
            </button>

            <div className="mt-4 text-xs text-gray-500">
              Click anywhere to begin
            </div>
          </div>
        </div>
      )}

      {/* Loading screen */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-white z-20 bg-black">
          <div className="text-center">
            <div className="mb-4 text-xl">Loading DOOM...</div>
            <div className="text-sm text-gray-400">
              Initializing WebAssembly...
            </div>
          </div>
        </div>
      )}

      {/* Black bars to completely cover all debug UI - INCREASED COVERAGE */}
      {!showOverlay && (
        <>
          {/* Cover entire right side (debug console/stats) - MUCH WIDER */}
          <div className="absolute top-0 right-0 w-[400px] h-full bg-black z-[5] pointer-events-none" />
          
          {/* Cover entire top (article link and header) - MUCH TALLER */}
          <div className="absolute top-0 left-0 right-0 h-[150px] bg-black z-[5] pointer-events-none" />
          
          {/* Cover entire bottom (extra text and stats) - MUCH TALLER */}
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-black z-[5] pointer-events-none" />

          {/* Left side coverage for safety */}
          <div className="absolute top-0 left-0 w-[50px] h-full bg-black z-[5] pointer-events-none" />
        </>
      )}
      
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
        allow="autoplay; fullscreen; gamepad; pointer-lock"
        sandbox="allow-scripts allow-same-origin allow-pointer-lock"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
