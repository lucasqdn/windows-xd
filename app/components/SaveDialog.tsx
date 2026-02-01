"use client";

import { useState } from "react";
import { getAllFiles, type FileItem } from "@/app/lib/fileSystem";

type SaveDialogProps = {
  defaultName?: string;
  defaultExtension?: string;
  fileTypes?: Array<{ label: string; extension: string }>;
  onSave: (fileName: string, folder?: string) => void;
  onCancel: () => void;
};

export function SaveDialog({
  defaultName = "Untitled",
  defaultExtension = ".txt",
  fileTypes = [{ label: "Text Documents (*.txt)", extension: ".txt" }],
  onSave,
  onCancel,
}: SaveDialogProps) {
  const [fileName, setFileName] = useState(
    defaultName.endsWith(defaultExtension) ? defaultName : `${defaultName}${defaultExtension}`
  );
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined);
  const [fileType, setFileType] = useState(fileTypes[0]);

  const files = getAllFiles();
  const folders = files.filter((f) => f.type === "folder");

  const handleSave = () => {
    // Ensure filename has the correct extension
    let finalName = fileName.trim();
    if (!finalName.endsWith(fileType.extension)) {
      finalName = finalName.replace(/\.[^/.]+$/, "") + fileType.extension;
    }
    onSave(finalName, selectedFolder);
  };

  const handleFileTypeChange = (newType: typeof fileTypes[0]) => {
    setFileType(newType);
    // Update filename extension
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    setFileName(`${baseName}${newType.extension}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[10000]">
      <div className="win98-raised bg-[#c0c0c0] w-[500px] max-w-[90vw]">
        {/* Title Bar */}
        <div className="win98-titlebar-active px-2 py-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold">💾 Save As</span>
          </div>
          <button
            onClick={onCancel}
            className="win98-button px-2 py-0 text-xs leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
          {/* Save In Dropdown */}
          <div>
            <label className="text-xs font-bold block mb-1">Save in:</label>
            <div className="win98-raised flex items-center gap-1 mb-2">
              <select
                className="win98-inset flex-1 px-2 py-1 text-xs bg-white"
                value={selectedFolder || ""}
                onChange={(e) => setSelectedFolder(e.target.value || undefined)}
              >
                <option value="">My Computer</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    📁 {folder.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Folder View */}
          <div className="win98-inset bg-white h-[150px] overflow-auto p-2">
            <div className="space-y-1">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={`flex items-center gap-2 px-2 py-1 text-xs cursor-pointer ${
                    selectedFolder === folder.id
                      ? "bg-[#000080] text-white"
                      : "hover:bg-[#000080] hover:text-white"
                  }`}
                  onClick={() => setSelectedFolder(folder.id)}
                  onDoubleClick={() => {
                    setSelectedFolder(folder.id);
                  }}
                >
                  <span>📁</span>
                  <span>{folder.name}</span>
                </div>
              ))}
              {folders.length === 0 && (
                <div className="text-xs text-gray-500 text-center py-4">
                  No folders available
                </div>
              )}
            </div>
          </div>

          {/* File Name Input */}
          <div>
            <label className="text-xs font-bold block mb-1">File name:</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSave()}
              className="win98-inset w-full px-2 py-1 text-xs"
              autoFocus
            />
          </div>

          {/* File Type Dropdown */}
          <div>
            <label className="text-xs font-bold block mb-1">Save as type:</label>
            <select
              className="win98-inset w-full px-2 py-1 text-xs bg-white"
              value={fileType.extension}
              onChange={(e) => {
                const type = fileTypes.find((t) => t.extension === e.target.value);
                if (type) handleFileTypeChange(type);
              }}
            >
              {fileTypes.map((type) => (
                <option key={type.extension} value={type.extension}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 justify-end pt-2">
            <button onClick={handleSave} className="win98-button px-6 py-1 text-xs font-bold">
              Save
            </button>
            <button onClick={onCancel} className="win98-button px-6 py-1 text-xs">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
