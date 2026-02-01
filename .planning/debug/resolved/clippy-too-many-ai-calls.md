---
status: resolved
trigger: "Clippy showing connection failed errors. User wants Clippy to be reactive-only (no automatic AI calls)"
created: 2026-02-01T00:45:00Z
updated: 2026-02-01T00:55:00Z
---

## Current Focus

hypothesis: CONFIRMED - Clippy making unnecessary automatic AI calls
test: Removed automatic AI calls, replaced with canned context-aware messages
expecting: AI only called when user explicitly asks a question
next_action: Test that Clippy appears but doesn't call AI until user interacts

## Symptoms

expected: Clippy should only call AI when user types a question and submits
actual: Getting "Connection failed. Must be that 56k modem acting up again" error
errors: Connection failures
reproduction: Clippy appears automatically and makes AI calls
started: After implementing session-based rate limiting

## Eliminated

## Evidence

- timestamp: 2026-02-01T00:48:00Z
  checked: Clippy component useEffect hooks
  found: Two automatic AI calls - on manual trigger (line 101-104) and idle detection (line 107-114)
  implication: Every time Clippy appears, it immediately calls the API before user does anything

- timestamp: 2026-02-01T00:50:00Z
  checked: "Tips" button functionality
  found: Calls askClippy() which makes API request (line 401)
  implication: Even the tips button wastes API quota

- timestamp: 2026-02-01T00:52:00Z
  checked: Context awareness needs
  found: Can generate helpful messages based on open windows without AI
  implication: Simple JavaScript logic can provide context-aware greetings

## Resolution

root_cause: Clippy was making automatic AI calls whenever it appeared (idle detection, manual trigger, tips button). These unnecessary calls wasted API quota, hit rate limits, and caused connection errors.

fix: Made Clippy fully reactive - AI only calls when user explicitly asks:

1. **Removed automatic AI calls:**
   - Manual trigger: Now shows canned message instead of calling askClippy()
   - Idle detection: Now shows context-aware message without AI
   - Tips button: Now shows static help text instead of AI-generated tips

2. **Added lightweight context awareness:**
   - getIdleMessage() function checks open windows
   - Returns appropriate message based on what user is doing
   - No API call needed - pure JavaScript logic
   - Messages vary randomly for personality

3. **Result:**
   - Clippy appears when idle/triggered
   - Shows helpful, context-aware message instantly (no loading, no API call)
   - AI only called when user types question and clicks "Ask"
   - Saves API quota, prevents rate limit issues, eliminates connection errors

Example messages:
- No windows: "Just sitting there staring at the desktop? Want help opening something?"
- Notepad open: "Working in Notepad, huh? Need me to write something for you?"
- Games open: "Taking a break with games? Classic procrastination. I approve."

verification: Open Clippy - should appear instantly with message, no loading spinner, no API call until you type and ask

files_changed: ["app/components/Clippy.tsx"]
