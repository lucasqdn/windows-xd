'use client';

import { useEffect, useRef } from 'react';
import { useWindowManager } from '@/app/contexts/WindowManagerContext';

// Minesweeper from 98.js.org - with automatic window resizing based on difficulty
export default function Minesweeper({ id }: { id: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { updateWindowSize } = useWindowManager();

  useEffect(() => {
    // Listen for resize messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Check if message is from our minesweeper iframe
      if (event.data?.type === 'minesweeper-resize') {
        const { width, height } = event.data;
        
        // Calculate window size with proper spacing
        // Window border: 4px (2px left + 2px right from .win98-window)
        // The Minesweeper component uses -m-2 to cancel Window's p-2 padding
        const windowBorder = 4;
        
        // Extra buffer to ensure menu bar and all content fits comfortably
        // There seems to be a scaling issue where the window renders at ~75% of requested size
        // So we need to compensate by requesting more width
        // For Expert mode (502px table), we need much more buffer
        const scalingFactor = 1.33; // Compensate for the ~75% rendering issue
        const bufferWidth = 120;
        const bufferHeight = 40;
        
        const baseWidth = Math.ceil(width) + windowBorder + bufferWidth;
        const baseHeight = Math.ceil(height) + windowBorder + bufferHeight;
        
        // Apply scaling factor to width to compensate
        const newWidth = Math.ceil(baseWidth * scalingFactor);
        const newHeight = baseHeight;
        
        console.log('[Minesweeper] Auto-resize:', {
          contentWidth: width,
          contentHeight: height,
          windowWidth: newWidth,
          windowHeight: newHeight,
          windowId: id,
        });
        
        console.log('[Minesweeper] Calling updateWindowSize with:', { id, width: newWidth, height: newHeight });
        updateWindowSize(id, { width: newWidth, height: newHeight });
        
        // Verify the update happened
        setTimeout(() => {
          const windowEl = document.querySelector(`[data-window-id="${id}"]`);
          if (windowEl) {
            const computedStyle = window.getComputedStyle(windowEl);
            const parent = windowEl.parentElement;
            const parentStyle = parent ? window.getComputedStyle(parent) : null;
            console.log('[Minesweeper] Actual window size after update:', {
              requestedWidth: newWidth,
              actualWidth: computedStyle.width,
              actualHeight: computedStyle.height,
              parentWidth: parentStyle?.width,
              offsetWidth: (windowEl as HTMLElement).offsetWidth,
              clientWidth: (windowEl as HTMLElement).clientWidth,
            });
          }
        }, 100);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [id, updateWindowSize]);

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
