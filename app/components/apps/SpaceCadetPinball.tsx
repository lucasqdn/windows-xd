"use client";

import { useState, useEffect, useRef } from "react";

type SpaceCadetPinballProps = {
  id: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SpaceCadetPinball({ id: _id }: SpaceCadetPinballProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load directly without proxy (98.js.org allows iframe embedding)
  const pinballUrl = "https://98.js.org/programs/pinball/space-cadet.html";

  // Keep loading screen for minimum time even after iframe loads
  useEffect(() => {
    const minLoadTime = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading for at least 2 seconds

    return () => clearTimeout(minLoadTime);
  }, []);

  const handleIframeLoad = () => {
    // Verify the iframe actually loaded content
    try {
      if (iframeRef.current?.contentWindow) {
        console.log("[Pinball] Iframe loaded successfully");
      }
    } catch (e) {
      console.error("[Pinball] Iframe load error:", e);
    }
  };

  const handleIframeError = () => {
    console.error("[Pinball] Failed to load pinball game");
    setLoadError(true);
    setIsLoading(false);
  };

  return (
    <div className="h-full w-full flex flex-col bg-black relative overflow-auto">
      {/* Windows 98 Style Loading Screen */}
      {isLoading && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1a3a] text-white z-10">
          <div className="win98-raised bg-[#c0c0c0] p-6 flex flex-col items-center gap-4 min-w-[300px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-t-[#000080] border-r-[#000080] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <span className="text-black font-bold">
                Loading 3D Pinball...
              </span>
            </div>
            <div className="w-full win98-inset bg-white h-6 overflow-hidden">
              <div
                className="h-full bg-[#000080] animate-pulse"
                style={{ width: "70%" }}
              ></div>
            </div>
            <span className="text-black text-xs">Please wait...</span>
          </div>
        </div>
      )}

      {/* Error Screen */}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#c0c0c0] p-8">
          <div className="win98-raised bg-white p-6 flex flex-col items-start gap-4 max-w-md">
            <div className="flex items-start gap-3">
              <span className="text-4xl">⚠️</span>
              <div className="flex flex-col gap-2">
                <h2 className="font-bold text-black">
                  3D Pinball - Space Cadet
                </h2>
                <p className="text-black text-sm">
                  Unable to load the game. This may be due to:
                </p>
                <ul className="text-black text-xs list-disc list-inside">
                  <li>Network connection issues</li>
                  <li>External site unavailable</li>
                  <li>Browser security settings</li>
                </ul>
                <p className="text-black text-xs mt-2">
                  Try refreshing the window or check your internet connection.
                </p>
              </div>
            </div>
            <button
              className="win98-button px-4 py-1 text-sm ml-auto"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      )}

      {/* Game iframe - direct loading without proxy */}
      <iframe
        ref={iframeRef}
        src={pinballUrl}
        className="w-full h-full border-0"
        title="3D Pinball for Windows - Space Cadet"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-pointer-lock"
        allow="accelerometer; gyroscope"
      />
    </div>
  );
}
