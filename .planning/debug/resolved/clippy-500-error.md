---
status: resolved
trigger: "The issue still persist and also persists in localhost - Clippy API error: 500 Internal Server Error"
created: 2026-02-01T00:00:00Z
updated: 2026-02-01T00:15:00Z
---

## Current Focus

hypothesis: CONFIRMED - Model name was invalid
test: Changed all instances from "gemini-2.0-flash-exp" to "gemini-2.0-flash"
expecting: API should now work correctly
next_action: User needs to restart dev server to pick up changes

## Symptoms

expected: Clippy should respond to user questions using Gemini API
actual: Returns 500 Internal Server Error on localhost and production
errors: 
- Console: "Clippy API error: 500 Internal Server Error {}"
- At app/components/Clippy.tsx:54:17
- "Failed to fetch Clippy response: API returned 500: Internal Server Error"
reproduction: Ask Clippy any question in localhost or production
started: Issue persists after recent fixes (was working before model name change)

## Eliminated

## Evidence

- timestamp: 2026-02-01T00:10:00Z
  checked: Gemini API directly with test script
  found: GoogleGenerativeAIFetchError - 404 Not Found for model "gemini-2.0-flash-exp"
  implication: The model name is invalid, API doesn't recognize it

- timestamp: 2026-02-01T00:12:00Z
  checked: Listed available models via Gemini API
  found: Available models include "gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-pro"
  implication: Correct model name is "gemini-2.0-flash" (without "-exp")

- timestamp: 2026-02-01T00:14:00Z
  checked: Test script with correct model name
  found: API call succeeded with "gemini-2.0-flash"
  implication: Fix confirmed to work

## Resolution

root_cause: Model name "gemini-2.0-flash-exp" does not exist in Gemini API (404 Not Found). The correct model name is "gemini-2.0-flash" (without the "-exp" suffix).

fix: Updated all 3 instances in app/api/clippy/route.ts from "gemini-2.0-flash-exp" to "gemini-2.0-flash"
- Line 80: Text generation for improve/continue
- Line 99: Text generation for write requests  
- Line 271: Chat responses

verification: Test script confirmed API works with correct model name. User needs to restart dev server to pick up changes.

files_changed: ["app/api/clippy/route.ts"]
