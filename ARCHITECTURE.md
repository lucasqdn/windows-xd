# Windows XD - Architecture Documentation

## Overview
Windows XD is a modern recreation of Windows 98 built with Next.js 16, React 19, and TypeScript. This document explains the architectural decisions made when translating the original jQuery-based implementation to a modern React architecture.

---

## Core Architecture

### 1. **Window Management System**

#### Original jQuery Approach
The original implementation used direct DOM manipulation:
- **Window Creation**: Dynamic HTML string concatenation with `.after()`
- **State Tracking**: jQuery selectors like `$("#window-id")`
- **Z-Index Management**: Manual iteration through all `.window` elements
- **Show/Hide**: Direct CSS manipulation with `.show()` and `.hide()`

```javascript
// jQuery approach
var openWindow = function (id) {
  $("#" + id).show();
  $("#" + id).css("z-index", getTopZIndex() + 1);
};
```

#### Our React Approach
We use a centralized **Context Provider** pattern:
- **Component**: `WindowManagerContext.tsx`
- **State**: Single source of truth for all window states
- **Hook**: `useWindowManager()` for accessing window operations

```typescript
type WindowState = {
  id: string;
  title: string;
  component: React.ComponentType<{ id: string }>;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  icon?: string;
};
```

**Key Improvement**: Z-index is normalized on every focus operation to prevent infinite growth:

```typescript
const focusWindow = useCallback((id: string) => {
  setWindows(prev => {
    const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
    return sorted.map((w, i) => ({
      ...w,
      zIndex: w.id === id ? sorted.length : i,
      isMinimized: w.id === id ? false : w.isMinimized
    }));
  });
}, []);
```

---

### 2. **Draggable & Resizable Windows**

#### Original jQuery Approach
Used jQuery UI's drag and resize plugins:

```javascript
$(".window").draggable({
  handle: ".window-header",
  cursor: "move",
  containment: "window",
  stack: ".window",
});

$(".window").resizable({
  handles: "n, e, s, w, ne, se, sw, nw",
  minHeight: 250,
  minWidth: 350,
});
```

#### Our React Approach
We use **react-rnd** library (modern, React-friendly):

```typescript
<Rnd
  size={{ 
    width: windowState.isMaximized ? window.innerWidth : windowState.size.width, 
    height: windowState.isMaximized ? window.innerHeight - 30 : windowState.size.height 
  }}
  position={{ 
    x: windowState.isMaximized ? 0 : windowState.position.x, 
    y: windowState.isMaximized ? 0 : windowState.position.y 
  }}
  onDragStop={(e, d) => updateWindowPosition(id, { x: d.x, y: d.y })}
  onResizeStop={(e, direction, ref, delta, position) => {
    updateWindowSize(id, { width: parseInt(ref.style.width), height: parseInt(ref.style.height) });
    updateWindowPosition(id, { x: position.x, y: position.y });
  }}
  dragHandleClassName="window-title-bar"
  disableDragging={windowState.isMaximized}
  enableResizing={!windowState.isMaximized}
/>
```

**Key Features**:
- Drag disabled when maximized
- Resize disabled when maximized
- Position and size stored in React state (not DOM)

---

### 3. **Taskbar & Window Buttons**

#### Original jQuery Approach
Dynamic button creation on program launch:

```javascript
var createProgram = function (id, title, imgUrl, url) {
  $("#startbutton").after(
    "<span class='program' id='start-bar-" + id + "' >" + title + "</span>"
  );
  // ...
};
```

#### Our React Approach
**Declarative rendering** based on window state:

```typescript
{windows.filter(w => w.isOpen).map((window) => (
  <button
    key={window.id}
    className={`taskbar-button ${!window.isMinimized && window.zIndex === maxZ ? "active" : ""}`}
    onClick={() => handleTaskbarButtonClick(window.id)}
  >
    {window.icon && <span className="mr-1">{window.icon}</span>}
    {window.title}
  </button>
))}
```

**Key Improvement**: Taskbar buttons automatically update when window state changes (no manual DOM updates).

---

### 4. **Start Menu**

#### Original jQuery Approach
Static HTML with event delegation:

```javascript
$("#menu").on("click", ".launch", function (event) {
  var targetId = $(this).data("launch");
  var title = $(this).data("title");
  // ...
  createProgram(targetId, title, imgUrl, url);
});
```

#### Our React Approach
**Component-based** with controlled visibility:

```typescript
<StartMenu
  isOpen={startMenuOpen}
  onClose={() => setStartMenuOpen(false)}
  onProgramClick={onProgramLaunch}
/>
```

The menu items are defined as typed data structures:

```typescript
type MenuItem = {
  id: string;
  label: string;
  icon: string;
  hasSubmenu?: boolean;
};
```

---

### 5. **Desktop Icons**

#### Original jQuery Approach
Not present in the original (was a taskbar-only UI).

#### Our React Approach
Custom **DesktopIcon** component with double-click detection:

```typescript
export function DesktopIcon({ icon, label, onDoubleClick }: DesktopIconProps) {
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
  // ...
}
```

**Key Feature**: Pure JavaScript double-click detection without relying on `onDoubleClick` event.

---

## Styling Approach

### Windows 98 Aesthetic

#### Global CSS Variables
```css
:root {
  --win98-gray: #c0c0c0;
  --win98-desktop: #008080;
  --win98-blue: #000080;
  --win98-highlight: #0000ff;
  --win98-white: #ffffff;
  --win98-black: #000000;
  --win98-darkgray: #808080;
  --win98-lightgray: #dfdfdf;
}
```

#### Reusable 3D Bevel Classes
```css
.win98-raised {
  border-top: 2px solid var(--win98-white);
  border-left: 2px solid var(--win98-white);
  border-right: 2px solid var(--win98-black);
  border-bottom: 2px solid var(--win98-black);
  box-shadow: inset -1px -1px 0 var(--win98-darkgray), inset 1px 1px 0 var(--win98-lightgray);
  background: var(--win98-gray);
}

.win98-inset {
  border-top: 2px solid var(--win98-darkgray);
  border-left: 2px solid var(--win98-darkgray);
  border-right: 2px solid var(--win98-white);
  border-bottom: 2px solid var(--win98-white);
  box-shadow: inset 1px 1px 0 var(--win98-black), inset -1px -1px 0 var(--win98-lightgray);
  background: var(--win98-white);
}

.win98-button {
  /* 3D button effect */
}

.win98-button:active {
  /* Inverted borders for pressed state */
}
```

#### Title Bar Gradients
```css
.win98-titlebar-active {
  background: linear-gradient(to right, var(--win98-blue) 0%, #1084d0 100%);
  color: var(--win98-white);
  font-weight: bold;
}

.win98-titlebar-inactive {
  background: linear-gradient(to right, var(--win98-darkgray) 0%, #b5b5b5 100%);
  color: var(--win98-lightgray);
  font-weight: bold;
}
```

---

## File Structure

Following **AGENTS.md** conventions:

```
app/
├── components/
│   ├── apps/              # Application components
│   │   ├── Notepad.tsx
│   │   ├── Paint.tsx
│   │   └── FileExplorer.tsx
│   ├── Desktop.tsx        # Main desktop container
│   ├── DesktopIcon.tsx    # Desktop icon component
│   ├── StartMenu.tsx      # Start menu component
│   ├── Taskbar.tsx        # Taskbar component
│   └── Window.tsx         # Reusable window frame
├── contexts/
│   └── WindowManagerContext.tsx  # Global window state
├── globals.css            # Global styles
├── layout.tsx             # Root layout
└── page.tsx               # Home route
```

---

## Key Advantages Over jQuery Implementation

| Aspect | jQuery Approach | React Approach |
|--------|----------------|----------------|
| **State Management** | Scattered across DOM | Centralized Context |
| **Type Safety** | None (vanilla JS) | Full TypeScript |
| **Predictability** | Imperative DOM updates | Declarative rendering |
| **Testability** | Difficult to unit test | Components can be tested in isolation |
| **Z-Index** | Linear growth (0, 1, 2, ..., ∞) | Normalized on focus (prevents overflow) |
| **Window Creation** | String concatenation | Type-safe React components |
| **Performance** | jQuery re-queries DOM | Virtual DOM diffing |

---

## Component Communication

### Data Flow
```
Desktop (Provider)
  ↓ Context
WindowManager
  ↓ Hook
Window Components ↔ Taskbar ↔ StartMenu
```

All components communicate through the **WindowManagerContext**:
- `openWindow()`: Create new window
- `closeWindow()`: Remove window
- `focusWindow()`: Bring to front + restore if minimized
- `minimizeWindow()`: Hide window (keep in taskbar)
- `maximizeWindow()`: Toggle fullscreen
- `updateWindowPosition()`: Update x, y
- `updateWindowSize()`: Update width, height

---

## Future Enhancements

1. **localStorage Persistence**: Save window positions/states
2. **Keyboard Shortcuts**: Alt+Tab, Alt+F4, etc.
3. **Context Menus**: Right-click on desktop/taskbar
4. **Window Animations**: Minimize/maximize transitions
5. **Multi-Monitor Support**: Drag windows between virtual screens
6. **Theme Customization**: Switch color schemes

---

## Running the Project

```bash
# Development
npm run dev

# Production Build
npm run build
npm start

# Linting
npm run lint
```

---

## Technologies Used

- **Next.js 16.1.6**: App Router, Server/Client Components
- **React 19.2.3**: Hooks, Context API
- **TypeScript 5**: Strict mode enabled
- **Tailwind CSS 4**: Utility-first styling
- **react-rnd 10.5.2**: Drag and resize functionality
- **Geist Font**: Modern typography

---

## Conclusion

This implementation demonstrates a **modern, type-safe, maintainable** approach to recreating Windows 98's UI. By leveraging React's component model and TypeScript's type system, we've built a scalable foundation that can easily accommodate new applications, features, and customizations—all while maintaining the nostalgic aesthetic of the original Windows 98.

The key architectural decision was to **centralize all window state** in a React Context, allowing any component to interact with windows in a predictable, type-safe manner. This is a fundamental improvement over jQuery's imperative DOM manipulation approach.

---

**Built with ❤️ by the Windows XD Team**
