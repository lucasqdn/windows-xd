"use client";

import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";

type PaintProps = {
  id: string;
};

export type PaintHandle = {
  getCanvasDataUrl: () => string | null;
};

type Tool = "pencil" | "brush" | "eraser" | "fill" | "rectangle" | "circle";

const PaintComponent = forwardRef<PaintHandle, PaintProps>(function PaintComponent({ id }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>("pencil");
  const [currentColor, setCurrentColor] = useState("#000000");
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Expose getCanvasDataUrl method to parent
  useImperativeHandle(ref, () => ({
    getCanvasDataUrl: () => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      return canvas.toDataURL("image/png");
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize with white background
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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastPos({ x, y });

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
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === "pencil" || currentTool === "brush" || currentTool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      setLastPos({ x, y });
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
      </div>

      {/* Tool Bar */}
      <div className="win98-raised flex gap-0.5 p-1">
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
        <div className="win98-inset bg-white">
          <canvas
            ref={canvasRef}
            className="bg-white cursor-crosshair"
            width={600}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="win98-inset px-2 py-0.5 text-xs flex justify-between">
        <span>For Help, click Help Topics on the Help Menu.</span>
        <span>Tool: {currentTool}</span>
      </div>
    </div>
  );
});

export const Paint = PaintComponent;
