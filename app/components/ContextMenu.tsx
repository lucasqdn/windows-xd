"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";

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
  radioSelected?: boolean;
};

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const [submenuOpen, setSubmenuOpen] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
      ref={menuRef}
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
            className={`context-menu-item ${item.disabled ? "disabled" : ""} ${item.submenu ? "has-submenu" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!item.disabled && item.onClick && !item.submenu) {
                item.onClick();
                onClose();
              }
            }}
            onMouseEnter={() => {
              if (item.submenu) {
                setSubmenuOpen(index);
              } else {
                setSubmenuOpen(null);
              }
            }}
          >
            {item.radioSelected !== undefined && (
              <span className="radio-indicator">
                {item.radioSelected ? "●" : "○"}
              </span>
            )}
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <span>{item.label}</span>
            {item.submenu && <span className="ml-auto">▶</span>}
            
            {item.submenu && submenuOpen === index && (
              <div
                className="context-menu context-submenu"
                style={{
                  position: "absolute",
                  left: "100%",
                  top: 0,
                }}
              >
                {item.submenu.map((subitem, subindex) => {
                  if (subitem.divider) {
                    return (
                      <div
                        key={subindex}
                        className="border-t border-gray-500 my-1"
                        style={{ margin: "2px 0" }}
                      />
                    );
                  }
                  
                  return (
                    <div
                      key={subindex}
                      className={`context-menu-item ${subitem.disabled ? "disabled" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!subitem.disabled && subitem.onClick) {
                          subitem.onClick();
                          onClose();
                        }
                      }}
                    >
                      {subitem.radioSelected !== undefined && (
                        <span className="radio-indicator">
                          {subitem.radioSelected ? "●" : "○"}
                        </span>
                      )}
                      {subitem.icon && <span className="mr-2">{subitem.icon}</span>}
                      <span>{subitem.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
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
