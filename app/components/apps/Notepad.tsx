"use client";

import { useState, useEffect, useRef } from "react";
import { saveFile, getFile, type FileItem } from "@/app/lib/fileSystem";
import { SaveDialog } from "@/app/components/SaveDialog";

type NotepadProps = {
  id: string;
  fileId?: string;
};

export function Notepad({ id, fileId: initialFileId }: NotepadProps) {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("Untitled");
  const [fileId, setFileId] = useState<string | null>(initialFileId || null);
  const [isModified, setIsModified] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load file on mount if fileId is provided
  useEffect(() => {
    if (initialFileId) {
      const file = getFile(initialFileId);
      if (file) {
        setContent(file.content || "");
        setFileName(file.name);
        setFileId(file.id);
        setIsModified(false);
      }
    }
  }, [initialFileId]);

  useEffect(() => {
    const handleInsertText = (event: CustomEvent) => {
      const { text, replaceSelection } = event.detail;
      const textarea = textareaRef.current;
      
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = content;
      
      if (replaceSelection && start !== end) {
        // Replace selected text
        const newText = currentText.substring(0, start) + text + currentText.substring(end);
        setContent(newText);
        setIsModified(true);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + text.length;
          textarea.focus();
        }, 0);
      } else {
        // Insert at cursor position
        const newText = currentText.substring(0, start) + text + currentText.substring(start);
        setContent(newText);
        setIsModified(true);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + text.length;
          textarea.focus();
        }, 0);
      }
    };
    
    window.addEventListener(`notepad-insert-${id}` as any, handleInsertText as any);
    
    return () => {
      window.removeEventListener(`notepad-insert-${id}` as any, handleInsertText as any);
    };
  }, [id, content]);

  const handleSave = () => {
    if (!fileName || fileName === "Untitled") {
      setShowSaveDialog(true);
      return;
    }
    
    const savedFile = saveFile(fileId, fileName, content);
    setFileId(savedFile.id);
    setFileName(savedFile.name);
    setIsModified(false);
    
    // Dispatch event to refresh File Explorer
    window.dispatchEvent(new CustomEvent("file-system-changed"));
  };

  const handleSaveAs = (saveName: string, folderId?: string) => {
    const savedFile = saveFile(null, saveName, content, folderId);
    setFileId(savedFile.id);
    setFileName(savedFile.name);
    setIsModified(false);
    setShowSaveDialog(false);
    
    // Dispatch event to refresh File Explorer
    window.dispatchEvent(new CustomEvent("file-system-changed"));
  };

  const handleNew = () => {
    if (isModified) {
      if (!confirm("You have unsaved changes. Create new file anyway?")) {
        return;
      }
    }
    setContent("");
    setFileName("Untitled");
    setFileId(null);
    setIsModified(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="win98-raised flex gap-1 px-1 py-0.5 text-xs">
        <div className="relative group">
          <button className="px-2 hover:bg-[#000080] hover:text-white">File</button>
          <div className="hidden group-hover:block absolute top-full left-0 win98-raised bg-[#c0c0c0] shadow-lg z-10 min-w-[150px]">
            <button
              onClick={handleNew}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>📄</span> New
            </button>
            <button
              onClick={handleSave}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>💾</span> Save
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(true);
              }}
              className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <span>💾</span> Save As...
            </button>
          </div>
        </div>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Edit</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Search</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Help</button>
      </div>

      {/* Title showing filename */}
      <div className="win98-raised px-2 py-0.5 text-xs bg-[#c0c0c0]">
        {fileName}{isModified ? " *" : ""}
      </div>

      {/* Save As Dialog */}
      {showSaveDialog && (
        <SaveDialog
          defaultName={fileName}
          defaultExtension=".txt"
          fileTypes={[
            { label: "Text Documents (*.txt)", extension: ".txt" },
            { label: "All Files (*.*)", extension: "" },
          ]}
          onSave={handleSaveAs}
          onCancel={() => setShowSaveDialog(false)}
        />
      )}

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        className="flex-1 w-full p-2 font-mono text-sm border-0 outline-none resize-none bg-white"
        placeholder="Untitled - Notepad"
        value={content}
        onChange={handleContentChange}
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "13px",
          lineHeight: "1.5",
        }}
      />
    </div>
  );
}
