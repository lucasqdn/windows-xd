---
status: investigating
trigger: "Runtime error: rendered fewer hooks than expected at Desktop.tsx + hydration mismatch in layout.tsx"
created: 2026-01-31T23:00:00Z
updated: 2026-01-31T23:00:00Z
---

## Current Focus

hypothesis: Hook called conditionally inside event handler + font className hydration mismatch
test: Fix hook placement and add suppressHydrationWarning
expecting: Both errors resolved
next_action: Fix Desktop.tsx line 240 and layout.tsx line 31

## Symptoms

expected: Website loads without runtime errors
actual: Two errors occur
errors: 
  1. "Rendered fewer hooks than expected" at app/components/Desktop.tsx:328
  2. "Tree hydrated but some attributes didn't match" at app/layout.tsx:31
reproduction: Run `npm run dev` and load http://localhost:3000
started: After Phase 10 implementation (icon selection + theme system)

## Root Causes Found

### Error 1: Hooks Violation in Desktop.tsx
**Location**: Line 240 in `handleDesktopContextMenu` function
**Problem**: `const { theme } = useWindowManager();` called inside event handler
**Rule violated**: React Hooks must be called at top level, not inside callbacks/event handlers

### Error 2: Hydration Mismatch in layout.tsx  
**Location**: Line 31 in `<body>` tag
**Problem**: Next.js font className may cause server/client mismatch
**Solution**: Add `suppressHydrationWarning` to body tag

## Fixes

### Fix 1: Move useWindowManager to component top level
```typescript
// Desktop.tsx line 93 - ADD theme to destructured values
const { windows, openWindow, selectMultipleIcons, clearSelection, theme } = useWindowManager();

// Desktop.tsx line 240 - REMOVE hook call from event handler
const handleDesktopContextMenu = (e: React.MouseEvent) => {
  // REMOVED: const { theme } = useWindowManager();
  // Now use 'theme' from component scope
  
  const menuItems: ContextMenuItem[] = [
    // ... existing menu items
```

### Fix 2: Add suppressHydrationWarning to body
```typescript
// layout.tsx line 31
<body className={`${pixelifySans.className} ${tektur.variable}`} suppressHydrationWarning>
```

## Verification Steps

1. Apply both fixes
2. Run `npm run dev`
3. Check browser console for errors
4. Verify no "hooks" error
5. Verify no "hydration" warning
