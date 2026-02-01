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
  const [currentPath, setCurrentPath] = useState<string>("My Computer");
  const [viewMode, setViewMode] = useState<"icons" | "list">("icons");
  const [addressBarValue, setAddressBarValue] = useState<string>("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const { openWindow } = useWindowManager();

  const loadFiles = () => {
    const allFiles = folderId ? getFilesInFolder(folderId) : getFilesInFolder();
    setFiles(allFiles);
    updateCurrentPath();
  };

  // Update the address bar path based on current location
  const updateCurrentPath = () => {
    if (!folderId) {
      setCurrentPath("My Computer");
      setAddressBarValue("C:\\My Computer");
      return;
    }

    // Build path by traversing parent folders
    const allFiles = getAllFiles();
    const buildPath = (targetId: string): string => {
      const folder = allFiles.find((f) => f.id === targetId);
      if (!folder) return "";
      
      if (folder.parentId) {
        const parentPath = buildPath(folder.parentId);
        return parentPath ? `${parentPath}\\${folder.name}` : folder.name;
      }
      
      return folder.name;
    };

    const path = buildPath(folderId);
    const fullPath = `My Computer\\${path}`;
    setCurrentPath(fullPath);
    setAddressBarValue(`C:\\${fullPath}`);
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

  const handleSelectAll = () => {
    // Select all files - for Edit menu
    if (files.length > 0) {
      setSelectedFile(files[0].id); // Simplified - in real implementation would support multi-select
    }
  };

  const handleRefresh = () => {
    loadFiles();
  };

  const handleAddressBarNavigation = (address: string) => {
    // Parse the address and navigate to the folder
    let cleanPath = address.replace(/^C:\\/, '').trim();
    
    // Remove "My Computer" prefix if present
    if (cleanPath.startsWith("My Computer\\")) {
      cleanPath = cleanPath.replace(/^My Computer\\/, '');
    } else if (cleanPath === "My Computer") {
      cleanPath = "";
    }
    
    if (cleanPath === "") {
      // Navigate to root
      openWindow({
        title: "My Computer",
        component: (props) => <FileExplorer {...props} />,
        isMinimized: false,
        isMaximized: false,
        position: { x: 150, y: 100 },
        size: getWindowSize("my-computer"),
        icon: "💻",
      });
      return;
    }

    // Split path and find folder
    const pathParts = cleanPath.split('\\').filter(p => p.length > 0);
    const allFiles = getAllFiles();
    
    // Navigate through path parts to find the target folder
    let currentFolderId: string | undefined = undefined;
    
    for (const part of pathParts) {
      const folder = allFiles.find(
        f => f.type === 'folder' && 
        f.name === part && 
        f.parentId === currentFolderId
      );
      
      if (!folder) {
        alert(`Cannot find folder: ${part}`);
        setAddressBarValue(`C:\\${currentPath}`);
        return;
      }
      
      currentFolderId = folder.id;
    }
    
    // Open the target folder
    if (currentFolderId) {
      const targetFolder = allFiles.find(f => f.id === currentFolderId);
      if (targetFolder) {
        openWindow({
          title: targetFolder.name,
          component: (props) => <FileExplorer {...props} folderId={currentFolderId} />,
          isMinimized: false,
          isMaximized: false,
          position: { x: 150, y: 100 },
          size: getWindowSize("my-computer"),
          icon: "📁",
        });
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="win98-raised flex gap-1 px-1 py-0.5 text-xs">
        {/* File Menu */}
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

        {/* Edit Menu */}
        <div className="relative group">
          <button className="px-2 hover:bg-[#000080] hover:text-white">Edit</button>
          <div className="hidden group-hover:block absolute top-full left-0 win98-raised bg-[#c0c0c0] shadow-lg z-10 min-w-[150px]">
            <button
              onClick={handleSelectAll}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>☑️</span> Select All
            </button>
            <div className="border-t border-gray-500 my-1" />
            {selectedFile && (
              <>
                <button
                  onClick={() => {
                    const file = files.find((f) => f.id === selectedFile);
                    if (file) {
                      navigator.clipboard.writeText(file.content || file.name);
                    }
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                >
                  <span>📋</span> Copy
                </button>
                <button
                  onClick={() => {
                    const file = files.find((f) => f.id === selectedFile);
                    if (file) {
                      navigator.clipboard.writeText(file.content || file.name);
                      handleDelete(file.id, file.name);
                    }
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                >
                  <span>✂️</span> Cut
                </button>
              </>
            )}
          </div>
        </div>

        {/* View Menu */}
        <div className="relative group">
          <button className="px-2 hover:bg-[#000080] hover:text-white">View</button>
          <div className="hidden group-hover:block absolute top-full left-0 win98-raised bg-[#c0c0c0] shadow-lg z-10 min-w-[150px]">
            <button
              onClick={() => setViewMode("icons")}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>{viewMode === "icons" ? "•" : " "}</span> Large Icons
            </button>
            <button
              onClick={() => setViewMode("list")}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>{viewMode === "list" ? "•" : " "}</span> List
            </button>
            <div className="border-t border-gray-500 my-1" />
            <button
              onClick={handleRefresh}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>🔄</span> Refresh
            </button>
          </div>
        </div>

        {/* Favorites Menu */}
        <div className="relative group">
          <button className="px-2 hover:bg-[#000080] hover:text-white">Favorites</button>
          <div className="hidden group-hover:block absolute top-full left-0 win98-raised bg-[#c0c0c0] shadow-lg z-10 min-w-[180px]">
            <button
              onClick={() => {
                openWindow({
                  title: "My Documents",
                  component: (props) => <FileExplorer {...props} folderId="folder-mydocs" />,
                  isMinimized: false,
                  isMaximized: false,
                  position: { x: 150, y: 100 },
                  size: getWindowSize("my-computer"),
                  icon: "📁",
                });
              }}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>📄</span> My Documents
            </button>
            <button
              onClick={() => {
                openWindow({
                  title: "My Pictures",
                  component: (props) => <FileExplorer {...props} folderId="folder-pics" />,
                  isMinimized: false,
                  isMaximized: false,
                  position: { x: 150, y: 100 },
                  size: getWindowSize("my-computer"),
                  icon: "📁",
                });
              }}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>🖼️</span> My Pictures
            </button>
            <button
              onClick={() => {
                openWindow({
                  title: "My Music",
                  component: (props) => <FileExplorer {...props} folderId="folder-music" />,
                  isMinimized: false,
                  isMaximized: false,
                  position: { x: 150, y: 100 },
                  size: getWindowSize("my-computer"),
                  icon: "📁",
                });
              }}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>🎵</span> My Music
            </button>
          </div>
        </div>

        {/* Tools Menu */}
        <div className="relative group">
          <button className="px-2 hover:bg-[#000080] hover:text-white">Tools</button>
          <div className="hidden group-hover:block absolute top-full left-0 win98-raised bg-[#c0c0c0] shadow-lg z-10 min-w-[180px]">
            <button
              onClick={() => {
                const allFiles = getAllFiles();
                alert(`Total Files: ${allFiles.length}\nFolders: ${allFiles.filter(f => f.type === 'folder').length}\nFiles: ${allFiles.filter(f => f.type === 'file').length}`);
              }}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>📊</span> Folder Statistics
            </button>
            <button
              onClick={() => {
                const totalSize = files.reduce((sum, f) => sum + f.size, 0);
                alert(`Current folder size: ${formatFileSize(totalSize)}`);
              }}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>💾</span> Calculate Size
            </button>
            <div className="border-t border-gray-500 my-1" />
            <button
              onClick={() => {
                alert("Folder Options\n\nView: Configure folder view settings\nFile Types: Manage file associations\nOffline Files: Offline file settings");
              }}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>⚙️</span> Folder Options...
            </button>
          </div>
        </div>

        {/* Help Menu */}
        <div className="relative group">
          <button className="px-2 hover:bg-[#000080] hover:text-white">Help</button>
          <div className="hidden group-hover:block absolute top-full left-0 win98-raised bg-[#c0c0c0] shadow-lg z-10 min-w-[150px]">
            <button
              onClick={() => alert("Windows XD File Explorer\n\nNavigate your files and folders with this classic interface!")}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>❓</span> Help Topics
            </button>
            <div className="border-t border-gray-500 my-1" />
            <button
              onClick={() => alert("Windows XD File Explorer\nVersion 1.0\n\n© 2024 Windows XD")}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>ℹ️</span> About
            </button>
          </div>
        </div>
      </div>

      {/* Address Bar */}
      <div className="win98-raised flex items-center gap-1 px-1 py-1">
        <span className="text-xs">Address:</span>
        {isEditingAddress ? (
          <input
            type="text"
            value={addressBarValue}
            onChange={(e) => setAddressBarValue(e.target.value)}
            onBlur={() => {
              setIsEditingAddress(false);
              setAddressBarValue(`C:\\${currentPath}`);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddressBarNavigation(addressBarValue);
                setIsEditingAddress(false);
              } else if (e.key === 'Escape') {
                setIsEditingAddress(false);
                setAddressBarValue(`C:\\${currentPath}`);
              }
            }}
            className="win98-inset flex-1 px-2 py-0.5 text-xs bg-white focus:outline-none"
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        ) : (
          <div
            className="win98-inset flex-1 px-2 py-0.5 text-xs bg-white cursor-text select-text"
            onClick={() => setIsEditingAddress(true)}
            title="Click to edit address"
          >
            C:\{currentPath}
          </div>
        )}
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
        {viewMode === "icons" ? (
          // Icon View
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
        ) : (
          // List View
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#c0c0c0] border-b border-gray-400">
                <th className="text-left px-2 py-1">Name</th>
                <th className="text-left px-2 py-1">Size</th>
                <th className="text-left px-2 py-1">Type</th>
                <th className="text-left px-2 py-1">Modified</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.id}
                  className={`cursor-pointer border-b border-gray-200 ${
                    selectedFile === file.id ? "bg-[#000080] text-white" : "hover:bg-[#000080] hover:text-white"
                  }`}
                  onClick={() => setSelectedFile(file.id)}
                  onDoubleClick={() => handleFileDoubleClick(file)}
                >
                  <td className="px-2 py-1 flex items-center gap-2">
                    <span>{file.type === "folder" ? "📁" : file.imageData ? "🖼️" : "📝"}</span>
                    {renamingFile === file.id ? (
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => handleRename(file.id)}
                        onKeyPress={(e) => e.key === "Enter" && handleRename(file.id)}
                        className="text-xs px-1 text-black win98-inset"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      file.name
                    )}
                  </td>
                  <td className="px-2 py-1">{file.type === "folder" ? "" : formatFileSize(file.size)}</td>
                  <td className="px-2 py-1">{file.type === "folder" ? "File Folder" : "File"}</td>
                  <td className="px-2 py-1">{new Date(file.modified).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Status Bar */}
      <div className="win98-raised px-2 py-0.5 text-xs flex justify-between">
        <span>{files.length} object(s)</span>
        <span>{currentPath}</span>
      </div>
    </div>
  );
}
