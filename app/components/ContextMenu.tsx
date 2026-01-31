"use client";

import { useState, useEffect, type ReactNode } from "react";

type ContextMenuProps = {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
};

export type ContextMenuItem = {
  label?: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  submenu?: ContextMenuItem[];
};

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const [submenuOpen, setSubmenuOpen] = useState<number | null>(null);

  useEffect(() => {
    const handleClick = () => onClose();
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onClose();
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [onClose]);

  return (
    <div
      className="context-menu"
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 10000,
      }}
    >
      {items.map((item, index) => {
        if (item.divider) {
          return (
            <div
              key={index}
              className="border-t border-gray-500 my-1"
              style={{ margin: "2px 0" }}
            />
          );
        }

        return (
          <div
            key={index}
            className={`context-menu-item ${item.disabled ? "disabled" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!item.disabled && item.onClick) {
                item.onClick();
                onClose();
              }
            }}
            onMouseEnter={() => {
              if (item.submenu) {
                setSubmenuOpen(index);
              }
            }}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <span>{item.label}</span>
            {item.submenu && <span className="ml-auto">▶</span>}
          </div>
        );
      })}
    </div>
  );
}

type ContextMenuProviderProps = {
  children: ReactNode;
};

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    items: ContextMenuItem[];
  } | null>(null);

  const showContextMenu = (
    e: React.MouseEvent,
    items: ContextMenuItem[]
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items,
    });
  };

  const hideContextMenu = () => {
    setContextMenu(null);
  };

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
  };
}
