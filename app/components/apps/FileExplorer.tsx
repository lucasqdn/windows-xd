"use client";

import { useState, useEffect } from "react";
import {
  getAllFiles,
  getFilesInFolder,
  deleteFile,
  renameFile,
  createFolder,
  formatFileSize,
  type FileItem,
} from "@/app/lib/fileSystem";
import { useWindowManager } from "@/app/contexts/WindowManagerContext";
import { Notepad } from "./Notepad";
import { Paint } from "./Paint";
import { getWindowSize } from "@/app/config/windowSizes";

type FileExplorerProps = {
  id: string;
  folderId?: string;
};

export function FileExplorer({ id, folderId }: FileExplorerProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const { openWindow } = useWindowManager();

  const loadFiles = () => {
    const allFiles = folderId ? getFilesInFolder(folderId) : getFilesInFolder();
    setFiles(allFiles);
  };

  useEffect(() => {
    loadFiles();
    
    // Listen for file system changes
    const handleFileSystemChange = () => loadFiles();
    window.addEventListener("file-system-changed", handleFileSystemChange);
    
    return () => {
      window.removeEventListener("file-system-changed", handleFileSystemChange);
    };
  }, [folderId]);

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === "folder") {
      // Open folder in new File Explorer window, passing the folder ID
      openWindow({
        title: file.name,
        component: (props) => <FileExplorer {...props} folderId={file.id} />,
        isMinimized: false,
        isMaximized: false,
        position: { x: 150, y: 100 },
        size: getWindowSize("my-computer"),
        icon: "📁",
      });
    } else if (file.imageData) {
      // Open image file in Paint
      openWindow({
        title: file.name,
        component: (props) => <Paint {...props} fileId={file.id} />,
        isMinimized: false,
        isMaximized: false,
        position: { x: 150, y: 100 },
        size: getWindowSize("paint"),
        icon: "🎨",
      });
    } else {
      // Open text file in Notepad
      openWindow({
        title: file.name,
        component: (props) => <Notepad {...props} fileId={file.id} />,
        isMinimized: false,
        isMaximized: false,
        position: { x: 150, y: 100 },
        size: getWindowSize("notepad"),
        icon: "📝",
      });
    }
  };

  const handleDelete = (fileId: string, fileName: string) => {
    if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
      deleteFile(fileId);
      loadFiles();
    }
  };

  const startRename = (file: FileItem) => {
    setRenamingFile(file.id);
    setRenameValue(file.name);
  };

  const handleRename = (fileId: string) => {
    if (renameValue.trim()) {
      renameFile(fileId, renameValue.trim());
      loadFiles();
    }
    setRenamingFile(null);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim(), folderId);
      loadFiles();
      setShowNewFolderDialog(false);
      setNewFolderName("");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="win98-raised flex gap-1 px-1 py-0.5 text-xs">
        <div className="relative group">
          <button className="px-2 hover:bg-[#000080] hover:text-white">File</button>
          <div className="hidden group-hover:block absolute top-full left-0 win98-raised bg-[#c0c0c0] shadow-lg z-10 min-w-[150px]">
            <button
              onClick={() => setShowNewFolderDialog(true)}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>📁</span> New Folder
            </button>
            {selectedFile && (
              <>
                <div className="border-t border-gray-500 my-1" />
                <button
                  onClick={() => {
                    const file = files.find((f) => f.id === selectedFile);
                    if (file) startRename(file);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                >
                  <span>✏️</span> Rename
                </button>
                <button
                  onClick={() => {
                    const file = files.find((f) => f.id === selectedFile);
                    if (file) handleDelete(file.id, file.name);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                >
                  <span>🗑️</span> Delete
                </button>
              </>
            )}
          </div>
        </div>
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
          C:\{folderId ? files.find((f) => f.id === folderId)?.name || "My Computer" : "My Computer"}
        </div>
      </div>

      {/* New Folder Dialog */}
      {showNewFolderDialog && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="win98-raised bg-[#c0c0c0] p-2 min-w-[300px]">
            <div className="win98-titlebar-active px-2 py-1 flex items-center justify-between mb-2">
              <span className="text-xs font-bold">New Folder</span>
              <button
                onClick={() => setShowNewFolderDialog(false)}
                className="win98-button px-2 py-0 text-xs"
              >
                ✕
              </button>
            </div>
            <div className="p-3">
              <label className="text-xs block mb-1">Folder name:</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
                className="win98-inset w-full px-2 py-1 text-xs mb-3"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCreateFolder}
                  className="win98-button px-4 py-1 text-xs"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowNewFolderDialog(false)}
                  className="win98-button px-4 py-1 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 win98-inset bg-white p-2 overflow-auto">
        <div className="grid grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className={`flex flex-col items-center p-2 cursor-pointer ${
                selectedFile === file.id ? "bg-[#000080] text-white" : "hover:bg-[#000080] hover:text-white"
              }`}
              onClick={() => setSelectedFile(file.id)}
              onDoubleClick={() => handleFileDoubleClick(file)}
              onContextMenu={(e) => {
                e.preventDefault();
                setSelectedFile(file.id);
              }}
            >
              <div className="text-3xl">
                {file.type === "folder" ? "📁" : file.imageData ? "🖼️" : "📝"}
              </div>
              {renamingFile === file.id ? (
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => handleRename(file.id)}
                  onKeyPress={(e) => e.key === "Enter" && handleRename(file.id)}
                  className="text-xs mt-1 px-1 text-black text-center win98-inset"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="text-xs mt-1 text-center break-all">{file.name}</div>
              )}
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
