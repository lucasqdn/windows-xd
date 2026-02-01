"use client";

import { useState } from "react";
import Image from "next/image";
import { useWindowManager } from "@/app/contexts/WindowManagerContext";

type DesktopIconProps = {
  id: string;
  icon: string;
  label: string;
  onDoubleClick: () => void;
};

export function DesktopIcon({ id, icon, label, onDoubleClick }: DesktopIconProps) {
  const { selectedIcons, selectIcon } = useWindowManager();
  const isSelected = selectedIcons.includes(id);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (clickTimeout) {
      // Double click detected
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      onDoubleClick();
    } else {
      // Single click
      if (e.ctrlKey || e.metaKey) {
        // Multi-select (toggle)
        selectIcon(id, true);
      } else {
        // Single select (replace)
        selectIcon(id, false);
      }
      
      const timeout = setTimeout(() => {
        setClickTimeout(null);
      }, 300);
      setClickTimeout(timeout);
    }
  };

  return (
    <div
      id={`desktop-icon-${id}`}
      className={`desktop-icon ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
      data-desktop-icon={id}
    >
      <div className="w-12 h-12 relative">
        <Image
          src={icon}
          alt={label}
          fill
          className="object-contain"
        />
      </div>
      <div className="icon-label">{label}</div>
    </div>
  );
}
