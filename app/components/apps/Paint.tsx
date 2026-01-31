"use client";

type PaintProps = {
  id: string;
};

export function Paint({ id }: PaintProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="win98-raised flex gap-1 px-1 py-0.5 text-xs">
        <button className="px-2 hover:bg-[#000080] hover:text-white">File</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Edit</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">View</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Image</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Colors</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Help</button>
      </div>

      {/* Tool Bar */}
      <div className="win98-raised flex gap-0.5 p-1">
        <button className="win98-button w-6 h-6 text-xs p-0">✏️</button>
        <button className="win98-button w-6 h-6 text-xs p-0">🖌️</button>
        <button className="win98-button w-6 h-6 text-xs p-0">🪣</button>
        <button className="win98-button w-6 h-6 text-xs p-0">⬜</button>
        <button className="win98-button w-6 h-6 text-xs p-0">⭕</button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center bg-[#c0c0c0] p-2">
        <div className="win98-inset w-full h-full bg-white flex items-center justify-center">
          <canvas
            className="bg-white cursor-crosshair"
            width={600}
            height={400}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="win98-inset px-2 py-0.5 text-xs flex justify-between">
        <span>For Help, click Help Topics on the Help Menu.</span>
        <span>100%</span>
      </div>
    </div>
  );
}
