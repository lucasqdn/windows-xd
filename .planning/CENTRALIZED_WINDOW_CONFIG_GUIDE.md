# Window Size Configuration - User Guide

**Created:** 2026-01-31 19:50 UTC

---

## 🎯 Centralized Configuration

All window sizes are now controlled from **ONE single file:**

📁 **File:** `app/config/windowSizes.ts`

---

## 📝 Current Window Sizes

```typescript
'pinball': { 
  width: 600,   // Horizontal size
  height: 480   // Vertical size
},

'internet-explorer': { 
  width: 800, 
  height: 600 
},

'notepad': { 
  width: 600, 
  height: 400 
},

'paint': { 
  width: 600, 
  height: 400 
},

'chatroom': { 
  width: 600, 
  height: 400 
},

'my-computer': { 
  width: 600, 
  height: 400 
},

'recycle-bin': { 
  width: 600, 
  height: 400 
},

'default': { 
  width: 600, 
  height: 400 
}
```

---

## 🛠️ How to Change Window Sizes

### Step 1: Edit the Config File

Open `app/config/windowSizes.ts` and modify the values:

```typescript
export const WINDOW_SIZES: Record<AppId, WindowSize> = {
  'pinball': { 
    width: 800,   // ← CHANGE THIS
    height: 600   // ← CHANGE THIS
  },
  // ... other apps
};
```

### Step 2: Save the File

The dev server will automatically reload.

### Step 3: Test

1. **Refresh your browser** (F5)
2. **Close all open windows**
3. **Open the app** (double-click icon)
4. **Verify the new size**

---

## 🔍 Understanding Width vs Height

**IMPORTANT:** 
- **Width** = Horizontal dimension (left to right)
- **Height** = Vertical dimension (top to bottom)

```
┌─────────────────────────────┐  ↑
│                             │  │
│                             │  │ Height (600)
│         Window              │  │
│                             │  │
└─────────────────────────────┘  ↓
←──────── Width (800) ────────→
```

---

## 🎮 Pinball Specific Notes

The Space Cadet Pinball game has a **vertical table** (portrait orientation).

### Recommended Sizes:

**Option 1: Classic proportions (current)**
```typescript
'pinball': { width: 600, height: 480 }
```

**Option 2: Larger view**
```typescript
'pinball': { width: 800, height: 640 }
```

**Option 3: Wide view (if scoreboard is on the side)**
```typescript
'pinball': { width: 800, height: 600 }
```

**Option 4: Maximum visibility**
```typescript
'pinball': { width: 1024, height: 768 }
```

---

## 📊 Testing Checklist

After changing sizes:

1. ✅ **Close ALL windows** (very important!)
2. ✅ **Refresh browser** (F5)
3. ✅ **Check console** for size logs:
   ```
   [Desktop] Opening 3D Pinball with size: { width: 600, height: 480 }
   [WindowManager] Opening window "3D Pinball" with size: { width: 600, height: 480 }
   [Window] Rendering "3D Pinball" - width: 600, height: 480
   ```
4. ✅ **Visually confirm** window dimensions
5. ✅ **Test game functionality**

---

## 🚨 Troubleshooting

### Problem: Size not changing

**Solution 1: Close existing windows**
- The size only applies when creating NEW windows
- Close the window and reopen it

**Solution 2: Hard refresh**
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

**Solution 3: Check console logs**
- Press F12 → Console tab
- Look for `[Desktop]`, `[WindowManager]`, `[Window]` logs
- Verify the size being passed matches your config

### Problem: Window appears wrong orientation

**Check your width vs height:**
- If window is too TALL and NARROW → increase width, decrease height
- If window is too WIDE and SHORT → decrease width, increase height

**Example:**
```typescript
// Too tall and narrow:
{ width: 400, height: 800 }  ← Vertical rectangle

// Better balanced:
{ width: 600, height: 480 }  ← Slightly horizontal

// Too wide and short:
{ width: 1200, height: 400 }  ← Horizontal rectangle
```

---

## 📁 Files Modified

### 1. `app/config/windowSizes.ts` ✅ NEW
- Centralized config file
- All sizes defined here

### 2. `app/components/Desktop.tsx` ✅ UPDATED
- Now imports `getWindowSize()`
- Uses centralized config

### 3. `app/components/Clippy.tsx` ✅ UPDATED
- Now imports `getWindowSize()`
- Uses centralized config for IE

### 4. `app/components/Window.tsx` ✅ UPDATED
- Added debug logging
- Shows actual rendered size in console

---

## 🔄 Migration Summary

### Before (Old System):
- Desktop.tsx: Hardcoded sizes
- Clippy.tsx: Hardcoded IE size
- No central config
- Inconsistent sizes

### After (New System):
✅ One central config file
✅ All files reference the config
✅ Consistent sizes across the app
✅ Easy to modify and maintain
✅ Debug logging added

---

## 💡 Advanced Usage

### Add a New App

1. Add app ID to type:
```typescript
export type AppId = 
  | 'pinball'
  | 'my-new-app'  // ← Add here
  | 'default';
```

2. Add size config:
```typescript
export const WINDOW_SIZES: Record<AppId, WindowSize> = {
  'my-new-app': { width: 700, height: 500 },
  // ... other apps
};
```

3. Use in Desktop.tsx:
```typescript
{
  id: "my-new-app",
  icon: "/my-app-icon.png",
  label: "My App",
  component: MyApp,
}
```

The size will automatically be applied!

---

## ✅ Summary

- ✅ **Centralized config created**
- ✅ **Desktop.tsx updated** to use config
- ✅ **Clippy.tsx updated** to use config
- ✅ **Debug logging added**
- ✅ **All sizes now consistent**
- ✅ **Easy to modify in one place**

**To change any window size:** Edit `app/config/windowSizes.ts`
