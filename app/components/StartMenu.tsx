"use client";

import { useState, useEffect } from "react";
import { useSoundEffects } from "@/app/hooks/useSoundEffects";
import Image from "next/image";

type StartMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onProgramClick: (program: string) => void;
};

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  isImage?: boolean;
  hasSubmenu?: boolean;
};

const menuItems: MenuItem[] = [
  { id: "programs", label: "Programs", icon: "📁", hasSubmenu: true },
  { id: "documents", label: "Documents", icon: "📄" },
  { id: "settings", label: "Settings", icon: "⚙️" },
  { id: "find", label: "Find", icon: "🔍" },
  { id: "help", label: "Help", icon: "❓" },
  { id: "run", label: "Run...", icon: "▶️" },
  { id: "shutdown", label: "Shut Down...", icon: "⏻" },
];

const programItems: MenuItem[] = [
  { id: "notepad", label: "Notepad", icon: "/notepad-4.png", isImage: true },
  { id: "paint", label: "Paint", icon: "/paint_old-0.png", isImage: true },
  { id: "minesweeper", label: "Minesweeper", icon: "/game_mine_1-0.png", isImage: true },
  { id: "pinball", label: "3D Pinball", icon: "/pinball-icon.png", isImage: true },
  { id: "solitaire", label: "Solitaire", icon: "/solitaire-32x32.png", isImage: true },
  { id: "doom", label: "DOOM", icon: "/doom-icon.png", isImage: true },
  { id: "my-computer", label: "My Computer", icon: "/computer_explorer-2.png", isImage: true },
  { id: "recycle-bin", label: "Recycle Bin", icon: "/recycle_bin_empty-2.png", isImage: true },
  { id: "chatroom", label: "Chat Room", icon: "/chatroom.png", isImage: true },
  { id: "media-player", label: "Windows Media Player", icon: "/media-player-icon.png", isImage: true },
  { id: "clippy", label: "Help (Clippy)", icon: "📎" },
];

export function StartMenu({ isOpen, onClose, onProgramClick }: StartMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { playSound } = useSoundEffects();

  // Play sound when menu opens/closes
  useEffect(() => {
    if (isOpen) {
      playSound('menuOpen');
    } else {
      // Only play close sound if menu was previously open
      if (hoveredItem !== null) {
        playSound('menuClose');
      }
    }
  }, [isOpen, playSound]); // Note: intentionally not including hoveredItem to avoid extra sound calls

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
      />
      
      <div className="start-menu start-menu-slide-up z-[9999]">
        {/* Windows 98 Logo Banner */}
        <div
          className="flex items-end px-1 py-2 text-white text-xs font-bold"
          style={{
            background: "linear-gradient(to bottom, #000080 0%, #1084d0 100%)",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            width: "24px",
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          Windows 98
        </div>
        
        <div className="ml-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="start-menu-item relative"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => {
                if (item.id === "programs") {
                  // Submenu handled by hover
                  return;
                }
                if (item.id === "help") {
                  onProgramClick("clippy");
                  onClose();
                  return;
                }
                if (item.id === "shutdown") {
                  alert("This is a demo. No actual shutdown will occur.");
                  onClose();
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.hasSubmenu && <span className="ml-auto">▶</span>}
              
              {/* Programs Submenu */}
              {item.id === "programs" && hoveredItem === "programs" && (
                <div 
                  className="start-menu-submenu submenu-slide-out"
                  onMouseEnter={() => setHoveredItem("programs")}
                >
                  {programItems.map((program) => (
                    <div
                      key={program.id}
                      className="start-menu-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProgramClick(program.id);
                        onClose();
                      }}
                    >
                      {program.isImage ? (
                        <Image
                          src={program.icon}
                          alt={program.label}
                          width={16}
                          height={16}
                          className="flex-shrink-0"
                        />
                      ) : (
                        <span>{program.icon}</span>
                      )}
                      <span>{program.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className="border-t border-gray-500 my-1" />
        </div>
      </div>
    </>
  );
}
