"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useWindowManager } from "@/app/contexts/WindowManagerContext";

type DesktopIconProps = {
  id: string;
  icon: string;
  label: string;
  onDoubleClick: () => void;
  index: number;
  onDragStart: (iconId: string) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: () => void;
  gridPosition: { x: number; y: number };
};

export function DesktopIcon({ 
  id, 
  icon, 
  label, 
  onDoubleClick, 
  index, 
  onDragStart,
  onDragMove,
  onDragEnd,
  gridPosition 
}: DesktopIconProps) {
  const { selectedIcons, selectIcon } = useWindowManager();
  const isSelected = selectedIcons.includes(id);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const hasMoved = useRef(false);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click

    e.stopPropagation();
    
    // Select icon if not already selected
    if (!isSelected) {
      if (e.ctrlKey || e.metaKey) {
        selectIcon(id, true);
      } else {
        selectIcon(id, false);
      }
    }

    dragStartPos.current = { x: e.clientX, y: e.clientY };
    hasMoved.current = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartPos.current) return;

      const deltaX = moveEvent.clientX - dragStartPos.current.x;
      const deltaY = moveEvent.clientY - dragStartPos.current.y;

      // Only start dragging if moved more than 5px
      if (!hasMoved.current && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
        hasMoved.current = true;
        setIsDragging(true);
        onDragStart(id);
      }

      if (hasMoved.current) {
        setDragOffset({ x: deltaX, y: deltaY });
        onDragMove(moveEvent.clientX, moveEvent.clientY);
      }
    };

    const handleMouseUp = () => {
      if (hasMoved.current) {
        onDragEnd();
      }
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      dragStartPos.current = null;
      hasMoved.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const displayX = isDragging ? gridPosition.x + dragOffset.x : gridPosition.x;
  const displayY = isDragging ? gridPosition.y + dragOffset.y : gridPosition.y;

  return (
    <div
      id={`desktop-icon-${id}`}
      className={`desktop-icon ${isSelected ? "selected" : ""} ${isDragging ? "dragging" : ""}`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      data-desktop-icon={id}
      style={{
        position: 'absolute',
        left: `${displayX}px`,
        top: `${displayY}px`,
        transition: isDragging ? 'none' : 'all 0.2s ease',
      }}
    >
      <div className="w-12 h-12 relative flex items-center justify-center">
        <Image
          src={icon}
          alt={label}
          width={48}
          height={48}
          className="object-contain"
          draggable={false}
          style={{ width: '48px', height: '48px' }}
        />
      </div>
      <div className="icon-label">{label}</div>
    </div>
  );
}
