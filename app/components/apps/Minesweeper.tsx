'use client';

import { useEffect, useRef } from 'react';
import { useWindowManager } from '@/app/contexts/WindowManagerContext';

// Minesweeper from 98.js.org - with automatic window resizing based on difficulty
export default function Minesweeper({ id }: { id: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { updateWindowSize, windows } = useWindowManager();

  useEffect(() => {
    // Listen for resize messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Check if message is from our minesweeper iframe
      if (event.data?.type === 'minesweeper-resize') {
        const { width, height } = event.data;
        
        // Get current window state
        const currentWindow = windows.find(w => w.id === id);
        
        // Don't resize if window is maximized - prevents flickering
        if (currentWindow?.isMaximized) {
          console.log('[Minesweeper] Ignoring resize - window is maximized');
          return;
        }
        
        // Calculate window size with proper spacing
        // Window border: 4px (2px left + 2px right from .win98-window)
        // The Minesweeper component uses -m-2 to cancel Window's p-2 padding
        const windowBorder = 4;
        
        // Title bar height
        const titleBarHeight = 20;
        
        // Buffer for comfortable display
        const bufferWidth = 8;  // Small horizontal buffer
        const bufferHeight = 8; // Small vertical buffer
        
        const newWidth = Math.ceil(width) + windowBorder + bufferWidth;
        const newHeight = Math.ceil(height) + windowBorder + bufferHeight + titleBarHeight;
        
        console.log('[Minesweeper] Auto-resize:', {
          contentWidth: width,
          contentHeight: height,
          windowWidth: newWidth,
          windowHeight: newHeight,
          windowId: id,
          isMaximized: currentWindow?.isMaximized,
        });
        
        updateWindowSize(id, { width: newWidth, height: newHeight });
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [id, updateWindowSize, windows]);

  return (
    <div className="w-full h-full overflow-auto -m-2 bg-[#bdbdbd]" style={{ minWidth: '100%', minHeight: '100%' }}>
      {/* Negative margin to cancel Window's p-2 padding */}
      {/* overflow-auto temporarily allows scrolling if content is cut off */}
      <iframe 
        ref={iframeRef}
        src="/98js-minesweeper/index.html" 
        className="border-0 block"
        title="Minesweeper"
        style={{ 
          display: 'block', 
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%',
          border: 'none'
        }}
      />
    </div>
  );
}
