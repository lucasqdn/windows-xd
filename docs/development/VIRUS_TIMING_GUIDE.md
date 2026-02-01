# Virus Timing Configuration

## How to Change Virus Timings

The virus sequence timings are controlled in `app/lib/virus/types.ts`:

```typescript
export const VIRUS_TIMING = {
  notificationDelay: 40000,        // 40s - Time before virus notification appears
  notificationRepeatDelay: 30000,  // 30s - Time before notification reappears if cancelled
  silentInfection: 3000,           // 3s - Silent phase before viruses spawn
  virusSpawnDuration: 20000,       // 20s - Total time for virus spawning phase
  virusMinInterval: 1,             // 1ms - Minimum interval for rapid spawning
  glitchDuration: 8000,            // 8s - Glitch/chaos phase duration
  bsodDuration: 5000,              // 5s - Blue screen display time
  ransomwareCountdown: 600,        // 600s (10 min) - Ransomware countdown
};
```

## Force Refresh After Changes

When you change timing values, Next.js might cache the old values. To ensure changes are applied:

### Method 1: Hard Refresh (Recommended)
1. Save your changes to `app/lib/virus/types.ts`
2. In your browser: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows/Linux)
3. This bypasses all caches

### Method 2: Clear Next.js Cache
```bash
# Stop dev server (Ctrl+C)
rm -rf .next
npm run dev
```

### Method 3: Disable Turbopack Cache (Development)
Already configured in `.env.development.local`:
```
NEXT_PRIVATE_DEBUG_CACHE=1
```

## Testing Your Changes

1. Make your timing changes in `app/lib/virus/types.ts`
2. Save the file
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
4. Wait for virus notification or trigger manually
5. Check browser console for timing logs:
   - `[VIRUS] Starting spawn phase - Duration: XXXms`
   - `[VIRUS] Spawned virus #1 at XXXms`
   - `[BSOD] Starting BSOD screen, duration: XXXms`

## Current Spawn Sequence

With the default values above:

1. **Notification appears** after 40s
2. Click "Run" → **Silent phase**: 3s
3. **Spawn phase** begins (20s total):
   - 4s → 1st virus
   - 8s → 2nd virus
   - 10s → 3rd virus
   - 12s → 4th virus
   - 13-16s → 4 viruses at 1s intervals
   - 16-17s → 4 viruses at 0.25s intervals
   - 17-17.5s → 4 viruses at 0.125s intervals
   - 17.5-20s → Rapid spawn at `virusMinInterval` (1ms)
4. **Glitch phase**: 8s of chaos
5. **BSOD**: 5s blue screen
6. **Ransomware**: 10 minute countdown

## Common Issues

### Changes Not Applied
- **Cause**: Next.js/Turbopack cached old values
- **Solution**: Hard refresh (Cmd+Shift+R)

### BSOD Lasting Longer Than Expected
- **Cause**: Shutdown sound playing longer than timer
- **Check**: Look for `[BSOD] Ending BSOD screen` log in console
- **Expected**: Should match `bsodDuration` value exactly

### Viruses Spawning at Wrong Times
- **Check Console Logs**: `[VIRUS] Spawned virus #X at XXXms`
- **Compare**: Actual time vs scheduled time
- **Note**: Some drift is normal (<100ms)

## Advanced: Custom Spawn Intervals

To change individual spawn intervals, edit `app/components/virus/VirusSimulation.tsx`:

```typescript
// Find this section around line 147:
cumulativeTime += 4000;  // Change this to modify interval
spawnQueue.push({ delay: cumulativeTime, virusNumber: 1 });
```

After editing, always hard refresh to see changes!
