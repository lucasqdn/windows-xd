"use client";

type FileExplorerProps = {
  id: string;
};

export function FileExplorer({ id }: FileExplorerProps) {
  const folders = [
    { name: "My Documents", icon: "📄" },
    { name: "My Pictures", icon: "🖼️" },
    { name: "My Music", icon: "🎵" },
    { name: "My Computer", icon: "💻" },
  ];

  const files = [
    { name: "readme.txt", icon: "📝", size: "1 KB" },
    { name: "image.jpg", icon: "🖼️", size: "245 KB" },
    { name: "document.doc", icon: "📄", size: "12 KB" },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="win98-raised flex gap-1 px-1 py-0.5 text-xs">
        <button className="px-2 hover:bg-[#000080] hover:text-white">File</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Edit</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">View</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Favorites</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Tools</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Help</button>
      </div>

      {/* Address Bar */}
      <div className="win98-raised flex items-center gap-1 px-1 py-1">
        <span className="text-xs">Address:</span>
        <div className="win98-inset flex-1 px-2 py-0.5 text-xs bg-white">
          C:\My Documents
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 win98-inset bg-white p-2 overflow-auto">
        <div className="grid grid-cols-4 gap-4">
          {folders.map((folder, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-2 cursor-pointer hover:bg-[#000080] hover:text-white"
            >
              <div className="text-3xl">{folder.icon}</div>
              <div className="text-xs mt-1">{folder.name}</div>
            </div>
          ))}
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-2 cursor-pointer hover:bg-[#000080] hover:text-white"
            >
              <div className="text-3xl">{file.icon}</div>
              <div className="text-xs mt-1">{file.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="win98-raised px-2 py-0.5 text-xs flex justify-between">
        <span>{files.length} object(s)</span>
        <span>My Computer</span>
      </div>
    </div>
  );
}
