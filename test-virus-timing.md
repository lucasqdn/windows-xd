# Virus Timing Test Plan

## Expected Sequence

Based on current VIRUS_TIMING:

1. **Silent Phase**: 3s (silentInfection)
2. **Sprite Spawn**: 20s (virusSpawnDuration)  
3. **Glitch Phase**: 8s (glitchDuration)
4. **BSOD**: 5s (bsodDuration)
5. **Ransomware**: Shows countdown

**Total before BSOD**: 3s + 20s + 8s = 31s
**BSOD duration**: 5s
**Total before ransomware**: 36s

## Hypothesis

User sees BSOD lasting ~20s. Possible causes:

1. **Glitch phase setTimeout getting throttled** (8s → 20s)
2. **BSOD requestAnimationFrame not working**
3. **Multiple phases getting stuck**
4. **User changed bsodDuration but cache not refreshed**

## Test

Need console logs to show:
- When each phase starts
- When each phase ends  
- Actual vs expected duration
- Whether timers are being throttled
