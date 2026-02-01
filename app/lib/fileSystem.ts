/**
 * Virtual File System
 * Stores files in localStorage for persistence
 */

export type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  imageData?: string; // Base64 encoded image for Paint files
  mimeType?: string; // MIME type for images (e.g., "image/png")
  size: number;
  created: number;
  modified: number;
  parentId?: string;
};

const STORAGE_KEY = "windows-xd-filesystem";

// Get all files from storage
export function getAllFiles(): FileItem[] {
  if (typeof window === "undefined") return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with default files
    const defaultFiles = getDefaultFiles();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFiles));
    return defaultFiles;
  }
  
  return JSON.parse(stored);
}

// Save all files to storage
function saveFiles(files: FileItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

// Get default files for fresh installation
function getDefaultFiles(): FileItem[] {
  // For large images, we'll store them as references to public files
  // The imageData will be the URL path instead of full base64 to save localStorage space
  
  return [
    {
      id: "folder-mydocs",
      name: "My Documents",
      type: "folder",
      size: 0,
      created: Date.now(),
      modified: Date.now(),
    },
    {
      id: "folder-pics",
      name: "My Pictures",
      type: "folder",
      size: 0,
      created: Date.now(),
      modified: Date.now(),
    },
    {
      id: "folder-music",
      name: "My Music",
      type: "folder",
      size: 0,
      created: Date.now(),
      modified: Date.now(),
    },
    {
      id: "file-readme",
      name: "readme.txt",
      type: "file",
      content: "Welcome to Windows XD!\n\nThis is a retro Windows 98 experience built for the web.\n\nTry opening different applications and exploring!",
      size: 120,
      created: Date.now(),
      modified: Date.now(),
      parentId: "folder-mydocs",
    },
    // Sample images in My Pictures folder (as URL references)
    {
      id: "img-background",
      name: "windows-xd backgroud.png",
      type: "file",
      imageData: "/windows-xd backgroud.png",
      mimeType: "image/png",
      size: 7354587, // Actual file size
      created: Date.now(),
      modified: Date.now(),
      parentId: "folder-pics",
    },
    {
      id: "img-logo",
      name: "windows-xd logo.png",
      type: "file",
      imageData: "/windows-xd logo.png",
      mimeType: "image/png",
      size: 6657555, // Actual file size
      created: Date.now(),
      modified: Date.now(),
      parentId: "folder-pics",
    },
    {
      id: "img-windows98",
      name: "windows-98.png",
      type: "file",
      imageData: "/windows-98-1.png",
      mimeType: "image/png",
      size: 2321, // Actual file size
      created: Date.now(),
      modified: Date.now(),
      parentId: "folder-pics",
    },
  ];
}

// Create a new file
export function createFile(name: string, content: string = "", parentId?: string): FileItem {
  const files = getAllFiles();
  
  const newFile: FileItem = {
    id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    type: "file",
    content,
    size: new Blob([content]).size,
    created: Date.now(),
    modified: Date.now(),
    parentId,
  };
  
  files.push(newFile);
  saveFiles(files);
  
  return newFile;
}

// Save file (update existing or create new)
export function saveFile(
  fileId: string | null,
  name: string,
  content: string,
  parentId?: string,
  imageData?: string,
  mimeType?: string
): FileItem {
  const files = getAllFiles();
  
  if (fileId) {
    // Update existing file
    const fileIndex = files.findIndex((f) => f.id === fileId);
    if (fileIndex !== -1) {
      files[fileIndex].name = name;
      files[fileIndex].content = content;
      files[fileIndex].imageData = imageData;
      files[fileIndex].mimeType = mimeType;
      files[fileIndex].size = imageData 
        ? Math.ceil(imageData.length * 0.75) // Estimate size from base64
        : new Blob([content]).size;
      files[fileIndex].modified = Date.now();
      saveFiles(files);
      return files[fileIndex];
    }
  }
  
  // Create new file
  const newFile: FileItem = {
    id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    type: "file",
    content,
    imageData,
    mimeType,
    size: imageData 
      ? Math.ceil(imageData.length * 0.75)
      : new Blob([content]).size,
    created: Date.now(),
    modified: Date.now(),
    parentId,
  };
  
  files.push(newFile);
  saveFiles(files);
  
  return newFile;
}

// Get file by ID
export function getFile(fileId: string): FileItem | null {
  const files = getAllFiles();
  return files.find((f) => f.id === fileId) || null;
}

// Delete file
export function deleteFile(fileId: string): boolean {
  const files = getAllFiles();
  const filtered = files.filter((f) => f.id !== fileId && f.parentId !== fileId);
  
  if (filtered.length < files.length) {
    saveFiles(filtered);
    return true;
  }
  
  return false;
}

// Rename file
export function renameFile(fileId: string, newName: string): boolean {
  const files = getAllFiles();
  const file = files.find((f) => f.id === fileId);
  
  if (file) {
    file.name = newName;
    file.modified = Date.now();
    saveFiles(files);
    return true;
  }
  
  return false;
}

// Get files in a folder
export function getFilesInFolder(folderId?: string): FileItem[] {
  const files = getAllFiles();
  
  if (!folderId) {
    // Root level - return items without parent
    return files.filter((f) => !f.parentId);
  }
  
  return files.filter((f) => f.parentId === folderId);
}

// Create folder
export function createFolder(name: string, parentId?: string): FileItem {
  const files = getAllFiles();
  
  const newFolder: FileItem = {
    id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    type: "folder",
    size: 0,
    created: Date.now(),
    modified: Date.now(),
    parentId,
  };
  
  files.push(newFolder);
  saveFiles(files);
  
  return newFolder;
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 KB";
  if (bytes < 1024) return "1 KB";
  if (bytes < 1024 * 1024) return Math.ceil(bytes / 1024) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
