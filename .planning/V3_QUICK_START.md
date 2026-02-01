# V3 Quick Reference

## What is V3?

V3 adds three entertainment features to windows-xd for hackathon demo:
- **Minesweeper** - Classic puzzle game
- **Pinball** - Physics-based arcade game  
- **Virus Simulation** - Dramatic "infection" effect (cosmetic only)

## Key Requirements Summary

### Minesweeper
- 3 difficulty levels (Beginner/Intermediate/Expert)
- Windows 98 authentic styling
- Timer, mine counter, smiley face
- High scores in localStorage

### Pinball
- Medium-advanced complexity
- Windows 98 "Space Cadet" style
- Ball physics with flippers
- Sound effects and scoring
- 3 balls per game

### Virus Simulation
- **Purely cosmetic** (no file/OS access)
- Sequence: 10s delay → spawn viruses (5s each) → glitch (5s) → shutdown (8s) → ransomware UI
- User can reload page to escape
- Realistic ransomware UI for impact
- Clear warnings before launch

## Implementation Timeline

**Estimated: 5-8 days**
- Day 1-2: Minesweeper
- Day 3-5: Pinball  
- Day 6-7: Virus Simulation
- Day 8: Testing & polish

## Safety Notes

**CRITICAL for Virus Simulation:**
- ✅ Browser-only simulation
- ✅ No filesystem access
- ✅ No actual OS shutdown
- ✅ No network requests
- ✅ User can reload to escape
- ✅ Clear disclaimers shown

## Asset Strategy

**Using placeholders initially:**
- Emoji for virus sprites (🦋 🦍)
- CSS for visual effects
- Web Audio API for sounds
- Can be swapped with real assets later

## Branching Strategy

```
main
  └─ v3 (integration branch)
      ├─ v3-minesweeper (Phase 7)
      ├─ v3-pinball (Phase 8)
      └─ v3-virus (Phase 9)
```

## Demo Flow for Hackathon

1. Show desktop → Open Minesweeper → Play briefly
2. Open Pinball → Launch ball, use flippers
3. Click virus icon → Dramatic infection sequence
4. Explain: "All cosmetic, no actual harm"
5. Reload to reset

**Demo Duration: 3-5 minutes**

## Next Steps

1. Review V3_ROADMAP.md for full details
2. Confirm asset approach (placeholders OK?)
3. Choose: implement all phases or start with Phase 7?

---

**Ready to build!** 🚀
