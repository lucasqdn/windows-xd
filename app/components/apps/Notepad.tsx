"use client";

import { useState } from "react";

type NotepadProps = {
  id: string;
};

export function Notepad({ id }: NotepadProps) {
  const [content, setContent] = useState("");

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="win98-raised flex gap-1 px-1 py-0.5 text-xs">
        <button className="px-2 hover:bg-[#000080] hover:text-white">File</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Edit</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Search</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Help</button>
      </div>

      {/* Text Area */}
      <textarea
        className="flex-1 w-full p-2 font-mono text-sm border-0 outline-none resize-none bg-white"
        placeholder="Untitled - Notepad"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "13px",
          lineHeight: "1.5",
        }}
      />
    </div>
  );
}
