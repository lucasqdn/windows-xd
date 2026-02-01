# Window Size Configuration Guide

**Last Updated:** 2026-01-31 19:30 UTC

## Where Window Sizes Are Defined

Window sizes for all applications are defined in **ONE CENTRAL LOCATION**:

📁 **File:** `app/components/Desktop.tsx`  
📍 **Lines:** 83-107  
🔧 **Function:** `handleIconDoubleClick()`

---

## Current Configuration

### Default Size (Most Apps)
```typescript
{ width: 600, height: 400 }
```

**Applied to:**
- Notepad
- Paint
- File Explorer (My Computer, Recycle Bin)
- Internet Explorer
- Chat Room

### Custom Size (Pinball Only)
```typescript
{ width: 1000, height: 600 }
```

**Applied to:**
- 3D Pinball (Space Cadet)

---

## Code Location

**File:** `app/components/Desktop.tsx`

```typescript
const handleIconDoubleClick = (iconData: DesktopIconData) => {
  // Check if window is already open
  const existingWindow = windows.find((w) => w.title === iconData.label);
  if (existingWindow) {
    // If window exists, just focus it instead of opening a new one
    return;
  }
  
  // Custom size for pinball - needs to be wide enough for game table + scoreboard
  // The original Space Cadet game is approximately 600x440 but might need more space
  const isPinball = iconData.id === "pinball";
  const windowSize = isPinball
    ? { width: 1000, height: 600 } // Large enough to show full game without cropping
    : { width: 600, height: 400 };

  console.log(`[Desktop] Opening ${iconData.label} with size:`, windowSize);

  openWindow({
    title: iconData.label,
    component: iconData.component,
    isMinimized: false,
    isMaximized: false,
    position: {
      x: 100 + windows.length * 30,
      y: 100 + windows.length * 30,
    },
    size: windowSize,      // ← SIZE IS SET HERE
    icon: iconData.icon,
  });
};
```

---

## How to Change Window Sizes

### Option 1: Change Pinball Size Only

**Location:** `app/components/Desktop.tsx` line 91

```typescript
// Change these values:
const windowSize = isPinball
  ? { width: 1200, height: 700 }  // NEW SIZE HERE
  : { width: 600, height: 400 };
```

### Option 2: Change Default Size for All Apps

**Location:** `app/components/Desktop.tsx` line 92

```typescript
const windowSize = isPinball
  ? { width: 1000, height: 600 }
  : { width: 800, height: 500 };  // NEW DEFAULT SIZE HERE
```

### Option 3: Add Individual Sizes for Each App

**Replace the simple check with a switch statement:**

```typescript
let windowSize;
switch (iconData.id) {
  case "pinball":
    windowSize = { width: 1000, height: 600 };
    break;
  case "paint":
    windowSize = { width: 700, height: 500 };
    break;
  case "internet-explorer":
    windowSize = { width: 900, height: 600 };
    break;
  case "chatroom":
    windowSize = { width: 500, height: 600 };
    break;
  default:
    windowSize = { width: 600, height: 400 };
}
```

---

## App IDs Reference

These IDs are used to identify which app is being opened:

| App Name          | ID                    | Current Size   |
|-------------------|-----------------------|----------------|
| My Computer       | `my-computer`         | 600×400        |
| Recycle Bin       | `recycle-bin`         | 600×400        |
| Internet Explorer | `internet-explorer`   | 600×400        |
| Notepad           | `notepad`             | 600×400        |
| Paint             | `paint`               | 600×400        |
| Chat Room         | `chatroom`            | 600×400        |
| 3D Pinball        | `pinball`             | **1000×600**   |

**Location of IDs:** `app/components/Desktop.tsx` lines 34-72

---

## Debugging Window Sizes

### Console Logging

I've added console logs to help debug window sizes:

**When a window opens, you'll see:**
```
[Desktop] Opening 3D Pinball with size: { width: 1000, height: 600 }
[WindowManager] Opening window "3D Pinball" with size: { width: 1000, height: 600 }
```

### How to Check in Browser

1. Open http://localhost:3000
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Double-click an app icon
5. Check the console output

**Expected for Pinball:**
```
[Desktop] Opening 3D Pinball with size: { width: 1000, height: 600 }
[WindowManager] Opening window "3D Pinball" with size: { width: 1000, height: 600 }
```

**Expected for Notepad:**
```
[Desktop] Opening Notepad with size: { width: 600, height: 400 }
[WindowManager] Opening window "Notepad" with size: { width: 600, height: 400 }
```

### If Size Doesn't Match

**Possible causes:**

1. **Window already open**: Close all windows first
   - The logic only creates new windows, it doesn't resize existing ones
   - Close the window and double-click the icon again

2. **Hot reload issue**: Hard refresh the page
   - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or close all windows and refresh with F5

3. **Check console logs**: See what size is actually being set
   - The logs will show exactly what size is being passed

---

## Flow Diagram

```
User double-clicks icon
    ↓
Desktop.tsx → handleIconDoubleClick()
    ↓
Check if window already exists
    ↓ (if exists)
    Return (do nothing)
    ↓ (if doesn't exist)
Determine window size based on iconData.id
    ↓
Call openWindow() with size
    ↓
WindowManagerContext → openWindow()
    ↓
Create new window with specified size
    ↓
Window.tsx renders with windowState.size
    ↓
Rnd component uses size for width/height
```

---

## Files Involved

| File | Purpose | Window Size Role |
|------|---------|------------------|
| `app/components/Desktop.tsx` | Desktop UI & icon handling | **Sets initial window size** ✅ |
| `app/contexts/WindowManagerContext.tsx` | Window state management | Stores size in React state |
| `app/components/Window.tsx` | Window rendering | Reads size from context |
| `app/components/apps/*.tsx` | App content | No size control |

---

## Summary

✅ **Window sizes ARE managed in Desktop.tsx**  
✅ **Line 91-92 controls all app sizes**  
✅ **Pinball is set to 1000×600**  
✅ **Other apps are set to 600×400**  
✅ **No localStorage caching anymore**  
✅ **Console logs added for debugging**  

---

## Next Steps

1. **Refresh your browser** at http://localhost:3000
2. **Open DevTools Console** (F12)
3. **Close any existing windows**
4. **Double-click "3D Pinball" icon**
5. **Check console logs** to verify size being set
6. **Check actual window size** on screen

If the size still doesn't match, the console logs will tell us exactly what's happening.
