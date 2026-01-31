"use client";

import { useState } from "react";

type DesktopIconProps = {
  id: string;
  icon: string;
  label: string;
  onDoubleClick: () => void;
};

export function DesktopIcon({ icon, label, onDoubleClick }: DesktopIconProps) {
  const [selected, setSelected] = useState(false);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      onDoubleClick();
    } else {
      setSelected(true);
      const timeout = setTimeout(() => {
        setClickTimeout(null);
      }, 300);
      setClickTimeout(timeout);
    }
  };

  return (
    <div
      className={`desktop-icon ${selected ? "selected" : ""}`}
      onClick={handleClick}
      onBlur={() => setSelected(false)}
    >
      <div className="text-4xl">{icon}</div>
      <div className="desktop-icon-text">{label}</div>
    </div>
  );
}
