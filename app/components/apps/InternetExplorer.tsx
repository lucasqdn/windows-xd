"use client";

import { useEffect, useState } from "react";

type InternetExplorerProps = {
  id: string;
};

export function InternetExplorer({ id }: InternetExplorerProps) {
  const [url, setUrl] = useState("https://www.google.com");
  const [inputUrl, setInputUrl] = useState("https://www.google.com");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(["https://www.google.com"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [proxyUrl, setProxyUrl] = useState("/api/proxy?url=" + encodeURIComponent("https://www.google.com"));

  // Listen for navigation commands from Clippy
  useEffect(() => {
    const handleNavigate = (event: CustomEvent<string>) => {
      if (event.detail) {
        navigateToUrl(event.detail);
      }
    };

    window.addEventListener(`ie-navigate-${id}`, handleNavigate as EventListener);

    return () => {
      window.removeEventListener(`ie-navigate-${id}`, handleNavigate as EventListener);
    };
  }, [id, historyIndex, history]);

  const navigateToUrl = (newUrl: string) => {
    // Add protocol if missing
    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      // Check if it's a search query or URL
      if (formattedUrl.includes(" ") || !formattedUrl.includes(".")) {
        // It's a search query - use Google
        formattedUrl = `https://www.google.com/search?q=${encodeURIComponent(formattedUrl)}`;
      } else {
        formattedUrl = `https://${formattedUrl}`;
      }
    }

    setIsLoading(true);
    setUrl(formattedUrl);
    setInputUrl(formattedUrl);
    setProxyUrl("/api/proxy?url=" + encodeURIComponent(formattedUrl));

    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(formattedUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleGo = () => {
    navigateToUrl(inputUrl);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const newUrl = history[newIndex];
      setUrl(newUrl);
      setInputUrl(newUrl);
      setProxyUrl("/api/proxy?url=" + encodeURIComponent(newUrl));
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const newUrl = history[newIndex];
      setUrl(newUrl);
      setInputUrl(newUrl);
      setProxyUrl("/api/proxy?url=" + encodeURIComponent(newUrl));
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Force iframe reload by changing key
    setProxyUrl("/api/proxy?url=" + encodeURIComponent(url) + "&t=" + Date.now());
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleHome = () => {
    navigateToUrl("https://www.google.com");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGo();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="win98-raised flex gap-1 px-1 py-0.5 text-xs border-b border-gray-400">
        <button className="px-2 hover:bg-[#000080] hover:text-white">File</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Edit</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">View</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Favorites</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Help</button>
      </div>

      {/* Address Bar */}
      <div className="win98-raised flex items-center gap-2 px-2 py-1 border-b border-gray-400">
        <span className="text-xs">Address:</span>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 win98-inset px-1 py-0.5 text-xs bg-white outline-none"
        />
        <button onClick={handleGo} className="win98-button px-2 py-0.5 text-xs">
          Go
        </button>
      </div>

      {/* Toolbar */}
      <div className="win98-raised flex gap-1 px-1 py-1 border-b border-gray-400">
        <button
          onClick={handleBack}
          disabled={historyIndex === 0}
          className="win98-button px-2 py-0.5 text-xs disabled:opacity-50"
          title="Back"
        >
          ◀️ Back
        </button>
        <button
          onClick={handleForward}
          disabled={historyIndex === history.length - 1}
          className="win98-button px-2 py-0.5 text-xs disabled:opacity-50"
          title="Forward"
        >
          Forward ▶️
        </button>
        <button onClick={handleRefresh} className="win98-button px-2 py-0.5 text-xs" title="Refresh">
          🔄 Refresh
        </button>
        <button onClick={handleHome} className="win98-button px-2 py-0.5 text-xs" title="Home">
          🏠 Home
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <span>Loading...</span>
          </div>
        )}
        <iframe
          key={proxyUrl}
          src={proxyUrl}
          className="w-full h-full border-0"
          title="Internet Explorer Browser"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>

      {/* Status Bar */}
      <div className="win98-inset px-2 py-0.5 text-xs flex justify-between border-t border-gray-400">
        <span>{isLoading ? "⏳ Loading..." : "✅ Done"}</span>
        <span>Internet Explorer 5.0</span>
      </div>
    </div>
  );
}
