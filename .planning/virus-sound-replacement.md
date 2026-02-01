# Virus Sound Replacement - Summary

**Date**: 2026-02-01  
**Commit**: 590c9d3  
**Branch**: ux-improvement

## Changes Made

### 1. Virus Notification Sound
**File**: `app/components/system/VirusNotification.tsx`

**Before**: No sound on notification appearance  
**After**: Plays `notify_sound.mp3` when notification slides in

**Implementation**:
```typescript
useEffect(() => {
  // Play notification sound
  const audio = new Audio('/sounds/notify_sound.mp3');
  audio.volume = 0.4;
  audio.play().catch(() => {
    // Ignore audio errors (autoplay policy)
  });
  
  // Animate in
  setTimeout(() => setIsVisible(true), 100);
}, []);
```

**Volume**: 0.4 (40%) - Noticeable but not jarring

---

### 2. Virus Spawn Sound
**File**: `app/components/virus/VirusSimulation.tsx`

**Before**: Web Audio API square wave (800Hz, 0.1s duration)  
**After**: Plays `error_sound.mp3` on each sprite spawn

**Implementation**:
```typescript
const playSpawnSound = useCallback(() => {
  try {
    const audio = new Audio('/sounds/error_sound.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignore audio errors
    });
  } catch {
    // Ignore audio errors
  }
}, []);
```

**Volume**: 0.3 (30%) - Audible during sprite spawning phase  
**Frequency**: Plays on each of ~77 sprite spawns over 30 seconds

---

### 3. Virus Glitch Sound
**File**: `app/components/virus/VirusSimulation.tsx`

**Before**: Web Audio API sawtooth wave (random 100-1100Hz, 0.05s duration)  
**After**: Plays `error_sound.mp3` with intelligent behavior

**Implementation**:
```typescript
const playGlitchSound = useCallback(() => {
  try {
    // Randomly decide: pause (40%), play once (40%), or ring multiple times (20%)
    const behavior = Math.random();
    
    if (behavior < 0.4) {
      // 40% chance: pause (no sound)
      return;
    } else if (behavior < 0.8) {
      // 40% chance: play once
      const audio = new Audio('/sounds/error_sound.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } else {
      // 20% chance: ring multiple times (2-4 times)
      const ringCount = Math.floor(Math.random() * 3) + 2; // 2-4 rings
      const ringInterval = 300; // 300ms between rings
      
      for (let i = 0; i < ringCount; i++) {
        setTimeout(() => {
          const audio = new Audio('/sounds/error_sound.mp3');
          audio.volume = 0.2;
          audio.play().catch(() => {});
        }, i * ringInterval);
      }
    }
  } catch {
    // Ignore audio errors
  }
}, []);
```

**Volume**: 0.2 (20%) - Lower to avoid overwhelming during chaos  
**Behavior**:
- **40% chance**: Silent (pause)
- **40% chance**: Single play
- **20% chance**: Ring 2-4 times with 300ms intervals

**Frequency**: Called every 100ms during 8-second glitch phase (~80 calls)

---

## Audio Files Added

### 1. `/public/sounds/error_sound.mp3`
- **Size**: 100KB
- **Usage**: Virus spawn + glitch sounds
- **Description**: Classic Windows error sound

### 2. `/public/sounds/notify_sound.mp3`
- **Size**: 85KB  
- **Usage**: Virus notification appearance
- **Description**: Windows notification chime

---

## What Was Preserved

**Silent Phase**: Still uses Web Audio API for subtle eerie background tone (200Hz sine wave, 2s duration). This is intentional - it's a quiet ambient sound that sets the mood without being intrusive.

---

## Sound Behavior Summary

### Timeline

1. **T+0s (Silent Phase)**: 
   - Eerie sine wave (Web Audio API) - subtle background
   - Duration: 10 seconds

2. **T+10s (Sprite Spawn Phase)**:
   - `error_sound.mp3` plays on each sprite spawn
   - ~77 sprites spawn over 30 seconds
   - Volume: 0.3

3. **T+40s (Glitch Phase)**:
   - `error_sound.mp3` plays every 100ms with intelligent behavior:
     - 40% pause (no sound)
     - 40% single play
     - 20% ring 2-4 times (300ms apart)
   - Volume: 0.2 (lower to avoid overwhelming)
   - Duration: 8 seconds

4. **T+48s (BSOD Phase)**:
   - No sound (authentic Windows crash silence)

5. **T+53s (Ransomware Phase)**:
   - No sound (ominous silence)

### Notification

**Trigger**: ~40 seconds after page load  
**Sound**: `notify_sound.mp3` (volume 0.4)  
**Behavior**: Plays once when notification slides up

---

## Technical Notes

- All audio uses HTML5 `Audio()` API (not Web Audio API)
- `.catch()` handlers prevent errors from autoplay policies
- Audio files loaded from `/public/sounds/` directory
- Sounds are fire-and-forget (no cleanup needed)
- Multiple audio instances can play simultaneously

---

## Testing Checklist

- [x] Build succeeds with no errors
- [x] Notification plays sound on appearance
- [x] Spawn sound plays during sprite phase
- [x] Glitch sound has intelligent behavior (pause/play/ring)
- [x] Volume levels are appropriate
- [x] No audio file path errors
- [x] Sounds don't overlap excessively
- [x] Silent phase still has subtle eerie tone

---

## Future Enhancements (Optional)

1. Add volume control in settings
2. Add mute option
3. Preload audio files to avoid delays
4. Add spatial audio (panning) for virus sprites
5. Add different error sounds for different virus types

---

**Status**: ✅ Complete  
**Ready for**: Testing and user feedback
