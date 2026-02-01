"use client";

import { useRef, useEffect, useState } from "react";

/**
 * Windows 98 Paint Application
 * 
 * Features:
 * - Drawing tools: pencil, brush, eraser
 * - Shape tools: line, rectangle, circle with live preview
 * - Fill tool: stack-based flood fill algorithm
 * - Undo/redo: command pattern for efficient history management
 * - AI image generation: powered by Google Gemini
 * 
 * Canvas size: 600x400px
 */

type PaintProps = {
  id: string;
};

type Tool = "pencil" | "brush" | "eraser" | "line" | "fill" | "rectangle" | "circle";

type DrawCommand = 
  | { type: "stroke"; points: Array<{ x: number; y: number }>; color: string; lineWidth: number }
  | { type: "line"; from: { x: number; y: number }; to: { x: number; y: number }; color: string; lineWidth: number }
  | { type: "rectangle"; start: { x: number; y: number }; width: number; height: number; color: string; lineWidth: number }
  | { type: "circle"; center: { x: number; y: number }; radiusX: number; radiusY: number; color: string; lineWidth: number }
  | { type: "fill"; imageData: ImageData };

export function Paint({ id }: PaintProps) {
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>("pencil");
  const [currentColor, setCurrentColor] = useState("#000000");
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const strokePoints = useRef<Array<{ x: number; y: number }>>([]);
  
  // Command history for undo/redo
  const [commandHistory, setCommandHistory] = useState<DrawCommand[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // AI generation state
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Initialize canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Listen for canvas data requests from Clippy
    const handleCanvasRequest = () => {
      const dataUrl = canvas.toDataURL("image/png");
      window.dispatchEvent(new CustomEvent("paint-canvas-data", { detail: dataUrl }));
    };

    window.addEventListener("request-paint-canvas-data", handleCanvasRequest);

    return () => {
      window.removeEventListener("request-paint-canvas-data", handleCanvasRequest);
    };
  }, []);

  // ============================================================================
  // Helper Functions
  // ============================================================================

  // Convert hex color to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // ============================================================================
  // Fill Tool
  // ============================================================================

  // Stack-based flood fill algorithm (avoids recursion stack overflow)
  const floodFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Get target color at click position
    const startPos = (startY * canvas.width + startX) * 4;
    const targetR = pixels[startPos];
    const targetG = pixels[startPos + 1];
    const targetB = pixels[startPos + 2];
    const targetA = pixels[startPos + 3];

    const fillColor = hexToRgb(currentColor);
    if (!fillColor) return;

    // Early exit if target and fill colors are identical
    if (targetR === fillColor.r && targetG === fillColor.g && targetB === fillColor.b) {
      return;
    }

    // Iterative flood fill using a stack
    const stack: Array<{ x: number; y: number }> = [{ x: startX, y: startY }];
    
    while (stack.length > 0) {
      const { x, y } = stack.pop()!;
      
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      
      const pos = (y * canvas.width + x) * 4;
      
      if (
        pixels[pos] === targetR &&
        pixels[pos + 1] === targetG &&
        pixels[pos + 2] === targetB &&
        pixels[pos + 3] === targetA
      ) {
        // Fill pixel with new color
        pixels[pos] = fillColor.r;
        pixels[pos + 1] = fillColor.g;
        pixels[pos + 2] = fillColor.b;
        pixels[pos + 3] = 255;

        // Add adjacent pixels to stack
        stack.push({ x: x + 1, y });
        stack.push({ x: x - 1, y });
        stack.push({ x, y: y + 1 });
        stack.push({ x, y: y - 1 });
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // ============================================================================
  // Command History & Undo/Redo
  // ============================================================================

  // Execute a draw command on the canvas
  const executeCommand = (command: DrawCommand) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    switch (command.type) {
      case "stroke":
        ctx.strokeStyle = command.color;
        ctx.lineWidth = command.lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        if (command.points.length > 0) {
          ctx.moveTo(command.points[0].x, command.points[0].y);
          for (let i = 1; i < command.points.length; i++) {
            ctx.lineTo(command.points[i].x, command.points[i].y);
          }
          ctx.stroke();
        }
        break;

      case "line":
        ctx.strokeStyle = command.color;
        ctx.lineWidth = command.lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(command.from.x, command.from.y);
        ctx.lineTo(command.to.x, command.to.y);
        ctx.stroke();
        break;

      case "rectangle":
        ctx.strokeStyle = command.color;
        ctx.lineWidth = command.lineWidth;
        ctx.strokeRect(command.start.x, command.start.y, command.width, command.height);
        break;

      case "circle":
        ctx.strokeStyle = command.color;
        ctx.lineWidth = command.lineWidth;
        ctx.beginPath();
        ctx.ellipse(command.center.x, command.center.y, command.radiusX, command.radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
        break;

      case "fill":
        ctx.putImageData(command.imageData, 0, 0);
        break;
    }
  };

  // Add a command to history
  const addCommand = (command: DrawCommand) => {
    // Remove any commands after current index (if we're not at the end)
    const newHistory = commandHistory.slice(0, historyIndex + 1);
    newHistory.push(command);
    setCommandHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Redraw canvas from command history
  const redrawCanvas = (upToIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Replay commands up to index
    for (let i = 0; i <= upToIndex && i < commandHistory.length; i++) {
      executeCommand(commandHistory[i]);
    }
  };

  // Undo last action
  const undo = () => {
    if (historyIndex >= 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      redrawCanvas(newIndex);
    }
  };

  // Redo last undone action
  const redo = () => {
    if (historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      redrawCanvas(newIndex);
    }
  };

  // ============================================================================
  // Drawing Event Handlers
  // ============================================================================

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastPos({ x, y });
    setStartPos({ x, y });

    // Fill tool works on click, not drag
    if (currentTool === "fill") {
      // Store canvas state before fill for undo
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        floodFill(Math.floor(x), Math.floor(y));
        // Store fill command with resulting image data
        const newImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        addCommand({ type: "fill", imageData: newImageData });
      }
      setIsDrawing(false);
      return;
    }

    // For stroke tools, initialize points array
    if (currentTool === "pencil" || currentTool === "brush" || currentTool === "eraser") {
      strokePoints.current = [{ x, y }];
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentTool === "brush" ? 5 : currentTool === "eraser" ? 10 : 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (currentTool === "eraser") {
      ctx.strokeStyle = "#FFFFFF";
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // For freehand tools (pencil, brush, eraser), draw immediately
    if (currentTool === "pencil" || currentTool === "brush" || currentTool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      setLastPos({ x, y });
      
      // Collect points for command history
      strokePoints.current.push({ x, y });
    }
    
    // For shape tools (line, rectangle, circle), draw preview
    if ((currentTool === "line" || currentTool === "rectangle" || currentTool === "circle") && previewCanvas) {
      const previewCtx = previewCanvas.getContext("2d");
      if (!previewCtx) return;
      
      // Clear preview canvas
      previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      
      // Set preview style
      previewCtx.strokeStyle = currentColor;
      previewCtx.lineWidth = 2;
      previewCtx.lineCap = "round";
      previewCtx.lineJoin = "round";
      
      if (currentTool === "line") {
        previewCtx.beginPath();
        previewCtx.moveTo(startPos.x, startPos.y);
        previewCtx.lineTo(x, y);
        previewCtx.stroke();
      } else if (currentTool === "rectangle") {
        const width = x - startPos.x;
        const height = y - startPos.y;
        previewCtx.strokeRect(startPos.x, startPos.y, width, height);
      } else if (currentTool === "circle") {
        const radiusX = Math.abs(x - startPos.x) / 2;
        const radiusY = Math.abs(y - startPos.y) / 2;
        const centerX = startPos.x + (x - startPos.x) / 2;
        const centerY = startPos.y + (y - startPos.y) / 2;
        
        previewCtx.beginPath();
        previewCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        previewCtx.stroke();
      }
    }
  };

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // For stroke tools, add command to history
    if (currentTool === "pencil" || currentTool === "brush" || currentTool === "eraser") {
      const color = currentTool === "eraser" ? "#FFFFFF" : currentColor;
      const lineWidth = currentTool === "brush" ? 5 : currentTool === "eraser" ? 10 : 2;
      
      if (strokePoints.current.length > 0) {
        addCommand({
          type: "stroke",
          points: [...strokePoints.current],
          color,
          lineWidth,
        });
        strokePoints.current = [];
      }
    }

    // For shape tools, commit the shape to the main canvas and add to history
    if (e && (currentTool === "line" || currentTool === "rectangle" || currentTool === "circle")) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (currentTool === "line") {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        addCommand({
          type: "line",
          from: { x: startPos.x, y: startPos.y },
          to: { x, y },
          color: currentColor,
          lineWidth: 2,
        });
      } else if (currentTool === "rectangle") {
        const width = x - startPos.x;
        const height = y - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, width, height);
        
        addCommand({
          type: "rectangle",
          start: { x: startPos.x, y: startPos.y },
          width,
          height,
          color: currentColor,
          lineWidth: 2,
        });
      } else if (currentTool === "circle") {
        const radiusX = Math.abs(x - startPos.x) / 2;
        const radiusY = Math.abs(y - startPos.y) / 2;
        const centerX = startPos.x + (x - startPos.x) / 2;
        const centerY = startPos.y + (y - startPos.y) / 2;
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
        
        addCommand({
          type: "circle",
          center: { x: centerX, y: centerY },
          radiusX,
          radiusY,
          color: currentColor,
          lineWidth: 2,
        });
      }

      // Clear preview canvas
      if (previewCanvas) {
        const previewCtx = previewCanvas.getContext("2d");
        if (previewCtx) {
          previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        }
      }
    }

    setIsDrawing(false);
  };

  // Clear canvas to white
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // ============================================================================
  // AI Image Generation
  // ============================================================================

  const generateAIImage = async () => {
    if (!aiPrompt.trim() || aiPrompt.length < 3) {
      setGenerationError("Please enter a more detailed description (at least 3 characters)");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch("/api/paint/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Create and load the generated image
      const img = new Image();
      
      img.onload = () => {
        // Calculate scaling to fit canvas while maintaining aspect ratio
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgAspect = img.width / img.height;
        const canvasAspect = canvasWidth / canvasHeight;

        let drawWidth = canvasWidth;
        let drawHeight = canvasHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (imgAspect > canvasAspect) {
          drawHeight = canvasWidth / imgAspect;
          offsetY = (canvasHeight - drawHeight) / 2;
        } else {
          drawWidth = canvasHeight * imgAspect;
          offsetX = (canvasWidth - drawWidth) / 2;
        }

        // Draw centered image on canvas
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Save to command history for undo/redo
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        addCommand({ type: "fill", imageData });
      };

      img.onerror = () => {
        setGenerationError("Failed to load generated image");
        setIsGenerating(false);
      };

      img.src = `data:${data.mimeType};base64,${data.imageData}`;

      // Close dialog on successful generation
      setShowAIDialog(false);
      setAIPrompt("");
    } catch (error: any) {
      setGenerationError(error.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="win98-raised flex gap-1 px-1 py-0.5 text-xs">
        <button className="px-2 hover:bg-[#000080] hover:text-white">File</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Edit</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">View</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white" onClick={clearCanvas}>
          Image
        </button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Colors</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Help</button>
        <div className="flex-1" />
        <button 
          className="px-2 hover:bg-[#000080] hover:text-white font-bold"
          onClick={() => setShowAIDialog(true)}
          title="Generate image from text using AI"
        >
          🤖 AI Generate
        </button>
      </div>

      {/* Tool Bar */}
      <div className="win98-raised flex gap-0.5 p-1">
        <button
          className="win98-button w-6 h-6 text-xs p-0"
          onClick={undo}
          disabled={historyIndex < 0}
          title="Undo (Ctrl+Z)"
        >
          ↶
        </button>
        <button
          className="win98-button w-6 h-6 text-xs p-0"
          onClick={redo}
          disabled={historyIndex >= commandHistory.length - 1}
          title="Redo (Ctrl+Y)"
        >
          ↷
        </button>
        <div className="w-px bg-gray-400 mx-1" />
        <button
          className={`win98-button w-6 h-6 text-xs p-0 ${currentTool === "pencil" ? "active" : ""}`}
          onClick={() => setCurrentTool("pencil")}
          title="Pencil"
        >
          ✏️
        </button>
        <button
          className={`win98-button w-6 h-6 text-xs p-0 ${currentTool === "brush" ? "active" : ""}`}
          onClick={() => setCurrentTool("brush")}
          title="Brush"
        >
          🖌️
        </button>
        <button
          className={`win98-button w-6 h-6 text-xs p-0 ${currentTool === "eraser" ? "active" : ""}`}
          onClick={() => setCurrentTool("eraser")}
          title="Eraser"
        >
          🧹
        </button>
        <button
          className={`win98-button w-6 h-6 text-xs p-0 ${currentTool === "fill" ? "active" : ""}`}
          onClick={() => setCurrentTool("fill")}
          title="Fill"
        >
          🪣
        </button>
        <div className="w-px bg-gray-400 mx-1" />
        <button
          className={`win98-button w-6 h-6 text-xs p-0 ${currentTool === "line" ? "active" : ""}`}
          onClick={() => setCurrentTool("line")}
          title="Line"
        >
          📏
        </button>
        <button
          className={`win98-button w-6 h-6 text-xs p-0 ${currentTool === "rectangle" ? "active" : ""}`}
          onClick={() => setCurrentTool("rectangle")}
          title="Rectangle"
        >
          ▭
        </button>
        <button
          className={`win98-button w-6 h-6 text-xs p-0 ${currentTool === "circle" ? "active" : ""}`}
          onClick={() => setCurrentTool("circle")}
          title="Circle"
        >
          ⭕
        </button>
        <div className="w-px bg-gray-400 mx-1" />
        <button
          className="win98-button w-6 h-6 text-xs p-0"
          onClick={clearCanvas}
          title="Clear"
        >
          🗑️
        </button>
        <div className="w-px bg-gray-400 mx-1" />
        <input
          type="color"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
          className="w-8 h-6 cursor-pointer"
          title="Color picker"
        />
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center bg-[#c0c0c0] p-2 overflow-auto">
        <div className="win98-inset bg-white relative">
          <canvas
            ref={canvasRef}
            className="bg-white"
            width={600}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          <canvas
            ref={previewCanvasRef}
            className="absolute top-0 left-0 pointer-events-none cursor-crosshair"
            width={600}
            height={400}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="win98-inset px-2 py-0.5 text-xs flex justify-between">
        <span>For Help, click Help Topics on the Help Menu.</span>
        <span>Tool: {currentTool}</span>
      </div>

      {/* AI Generate Dialog */}
      {showAIDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="win98-window bg-[#c0c0c0] w-[500px] max-w-[90vw]">
            {/* Title Bar */}
            <div className="win98-titlebar-active flex items-center justify-between px-1 py-0.5">
              <div className="flex items-center gap-1">
                <span className="text-white font-bold text-xs">🤖 AI Image Generator</span>
              </div>
              <button
                className="win98-button px-1.5 text-xs leading-none"
                onClick={() => {
                  setShowAIDialog(false);
                  setAIPrompt("");
                  setGenerationError(null);
                }}
              >
                ✕
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-3 space-y-3">
              <div className="text-xs">
                <p className="mb-2">Describe the image you want to generate. Be specific and detailed for best results!</p>
                <p className="text-gray-600 mb-2">
                  <strong>Examples:</strong> "a sunset over mountains", "a cute robot painting on canvas", "a pixel art castle"
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Your prompt:</label>
                <textarea
                  className="win98-inset w-full p-2 text-xs font-mono resize-none"
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAIPrompt(e.target.value)}
                  placeholder="Enter a detailed description of the image you want to create..."
                  disabled={isGenerating}
                  maxLength={1000}
                />
                <div className="text-xs text-gray-600 mt-1">
                  {aiPrompt.length}/1000 characters
                </div>
              </div>

              {generationError && (
                <div className="win98-inset bg-red-50 border border-red-300 p-2 text-xs text-red-700">
                  <strong>Error:</strong> {generationError}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  className="win98-button px-3 py-1 text-xs"
                  onClick={() => {
                    setShowAIDialog(false);
                    setAIPrompt("");
                    setGenerationError(null);
                  }}
                  disabled={isGenerating}
                >
                  Cancel
                </button>
                <button
                  className="win98-button px-3 py-1 text-xs font-bold"
                  onClick={generateAIImage}
                  disabled={isGenerating || aiPrompt.trim().length < 3}
                >
                  {isGenerating ? "⏳ Generating..." : "🎨 Generate Image"}
                </button>
              </div>

              {isGenerating && (
                <div className="text-xs text-center text-gray-600">
                  <p>✨ Creating your AI-generated image...</p>
                  <p className="mt-1">This may take 10-30 seconds.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
