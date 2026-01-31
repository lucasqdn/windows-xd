# Phase 5 Testing Guide: Real-time Chatroom

## Pre-Testing Setup

### 1. Start the Development Server

```bash
npm run dev
```

The server should start on http://localhost:3000 with Socket.IO enabled.

**Expected console output:**
```
> Ready on http://localhost:3000
> Socket.IO server running
```

### 2. Open Browser

Navigate to http://localhost:3000 in your browser.

---

## Test Suite

### Test 1: Launch Chat Room Window

**Steps:**
1. Double-click the "Chat Room" desktop icon
2. Chat window should open

**Expected Results:**
- ✅ Chat window opens with Windows 98 styling
- ✅ Left sidebar shows "Online (1)" header
- ✅ Your username appears in the user list with "(You)" suffix
- ✅ Connection status shows "● Connected" in green
- ✅ Welcome message appears: "Welcome to the chat room! Say hello to other users."
- ✅ Input field is enabled
- ✅ Send button is enabled

**Screenshot Check:**
- Left sidebar: 150px wide, user list, connection status at bottom
- Main area: messages display, input field at bottom with Send button

---

### Test 2: Username Generation

**Steps:**
1. Open chat room
2. Check your assigned username in the user list

**Expected Results:**
- ✅ Username follows format: [Adjective][Noun][Number]
- ✅ Examples: CoolGamer42, MegaLegend99, RetroWizard15
- ✅ Username appears in bold with "(You)" suffix

---

### Test 3: Send a Message

**Steps:**
1. Type "Hello, world!" in the input field
2. Click Send button (or press Enter)

**Expected Results:**
- ✅ Input field clears immediately
- ✅ Message appears in chat area
- ✅ Format: `[HH:MM AM/PM] YourUsername: Hello, world!`
- ✅ Your username is in purple/bold
- ✅ Timestamp is in gray
- ✅ Message text is in black
- ✅ No notification sound plays (it's your own message)

---

### Test 4: Multi-Client Messaging

**Steps:**
1. Open a second browser window (or incognito window) to http://localhost:3000
2. Open chat room in both windows
3. Send a message from Window 1
4. Check Window 2

**Expected Results:**

**Window 1:**
- ✅ System message appears: "*** [SecondUsername] joined the chat ***"
- ✅ User list shows 2 users
- ✅ Online count shows "Online (2)"
- ✅ Your sent message appears immediately
- ✅ No notification sound for your message

**Window 2:**
- ✅ System message appears: "*** [FirstUsername] joined the chat ***" (when Window 1 was already open)
- ✅ User list shows 2 users (both usernames)
- ✅ Online count shows "Online (2)"
- ✅ Message from Window 1 appears instantly
- ✅ **Notification sound plays (vintage beep)**
- ✅ Other user's username is in blue (not purple)

---

### Test 5: Join/Leave Notifications

**Steps:**
1. Have 2 browser windows open with chat
2. Close Window 2
3. Check Window 1

**Expected Results:**
- ✅ System message appears: "*** [SecondUsername] left the chat ***"
- ✅ User list updates to show only 1 user
- ✅ Online count shows "Online (1)"
- ✅ System messages are gray, italic, centered

---

### Test 6: Message History Limit

**Steps:**
1. Send 105 messages rapidly (copy-paste test messages)
2. Scroll to top of chat

**Expected Results:**
- ✅ Only last 100 messages visible
- ✅ Oldest messages are removed automatically
- ✅ Chat doesn't lag or freeze

---

### Test 7: Timestamp Format

**Steps:**
1. Send a message at various times of day
2. Check timestamp format

**Expected Results:**
- ✅ Morning (8:45 AM): `[8:45 AM]`
- ✅ Noon (12:00 PM): `[12:00 PM]`
- ✅ Afternoon (3:30 PM): `[3:30 PM]`
- ✅ No seconds shown
- ✅ 12-hour format (not 24-hour)

---

### Test 8: Enter Key Sends Message

**Steps:**
1. Type a message
2. Press Enter (without Shift)

**Expected Results:**
- ✅ Message sends immediately
- ✅ Input field clears

**Steps (Shift+Enter):**
1. Type a message
2. Press Shift+Enter

**Expected Results:**
- ✅ New line is added (for multi-line messages)
- ✅ Message does NOT send

---

### Test 9: Connection Status

**Steps:**
1. Stop the server (Ctrl+C in terminal)
2. Check chat window

**Expected Results:**
- ✅ Connection status changes to "● Disconnected" in red
- ✅ Input field becomes disabled
- ✅ Send button becomes disabled
- ✅ Console shows "Disconnected from chat server"

**Steps:**
1. Restart the server (`npm run dev`)
2. Check chat window

**Expected Results:**
- ✅ Automatically reconnects within a few seconds
- ✅ Connection status changes back to "● Connected" in green
- ✅ Input field becomes enabled
- ✅ Send button becomes enabled
- ✅ Console shows "Connected to chat server"

---

### Test 10: Empty Message Prevention

**Steps:**
1. Leave input field empty
2. Try to click Send

**Expected Results:**
- ✅ Send button is disabled when input is empty
- ✅ Pressing Enter does nothing

**Steps:**
1. Type only spaces "     "
2. Click Send

**Expected Results:**
- ✅ Message is not sent (trimmed to empty string)
- ✅ Input field clears

---

### Test 11: Long Messages

**Steps:**
1. Type a message with 200 characters
2. Try to type more

**Expected Results:**
- ✅ Input field has maxLength of 200 characters
- ✅ Cannot type beyond 200 characters

---

### Test 12: Windows 98 Styling

**Visual Inspection:**

**Left Sidebar:**
- ✅ 150px wide
- ✅ Dark blue header (#000080) with white text
- ✅ White background for user list
- ✅ Inset border (win98-inset class)
- ✅ Green dot (●) next to each username

**Main Chat Area:**
- ✅ White background
- ✅ Inset border (win98-inset class)
- ✅ Gray border (#c0c0c0) around window

**Input Area:**
- ✅ Inset border on input field
- ✅ Win98 raised button style on Send button
- ✅ Button has 3D bevel effect
- ✅ Button depresses when clicked (active state)

---

### Test 13: Auto-Scroll

**Steps:**
1. Send 20 messages so chat area scrolls
2. Scroll to top
3. Send a new message from another window

**Expected Results:**
- ✅ Chat automatically scrolls to bottom (newest message)
- ✅ Smooth scroll animation

---

### Test 14: Notification Sound

**Steps:**
1. Open 2 windows
2. Send a message from Window 1
3. Listen in Window 2

**Expected Results:**
- ✅ Vintage beep sound plays in Window 2
- ✅ Sound is short (0.1 seconds)
- ✅ Sound is not too loud
- ✅ Sound is a square wave at 800Hz (retro style)

**No sound should play for:**
- ✅ Your own messages
- ✅ System messages (join/leave)

---

### Test 15: Window Management Integration

**Steps:**
1. Open chat room
2. Test window controls (minimize, maximize, close)

**Expected Results:**
- ✅ Can drag window by title bar
- ✅ Can resize window from edges
- ✅ Minimize hides window, adds to taskbar
- ✅ Maximize fills screen
- ✅ Close removes window
- ✅ Clicking taskbar button restores minimized window
- ✅ Chat maintains connection when minimized

---

## Performance Tests

### Test 16: Multiple Users (Stress Test)

**Steps:**
1. Open 5+ browser windows/tabs
2. Send messages from multiple windows simultaneously

**Expected Results:**
- ✅ All messages appear in all windows
- ✅ No message loss
- ✅ No significant lag
- ✅ User list updates correctly
- ✅ Server logs show all connections

---

### Test 17: Memory Leak Check

**Steps:**
1. Open Chrome DevTools → Performance → Memory
2. Open and close chat window 10 times
3. Force garbage collection
4. Check memory usage

**Expected Results:**
- ✅ Memory usage doesn't continuously increase
- ✅ Socket connections properly cleaned up
- ✅ No detached DOM nodes

---

## Browser Compatibility

Test in multiple browsers:

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (Mac)

**Expected:** All features work identically across browsers.

---

## Error Handling

### Test 18: Server Disconnect During Message Send

**Steps:**
1. Type a message (don't send yet)
2. Stop the server
3. Try to send the message

**Expected Results:**
- ✅ Message doesn't send (connection is closed)
- ✅ Input field becomes disabled
- ✅ Status shows disconnected

---

### Test 19: Network Throttling

**Steps:**
1. Open DevTools → Network → Throttling → Slow 3G
2. Open chat room
3. Send messages

**Expected Results:**
- ✅ Connection still establishes (may take longer)
- ✅ Messages eventually sync
- ✅ No errors in console

---

## Success Criteria Summary

All Phase 5 requirements met:

- ✅ **CHAT-01**: Yahoo-style retro UI with left sidebar
- ✅ **CHAT-02**: Real-time messaging via WebSocket
- ✅ **CHAT-03**: Auto-generated usernames (adjective + noun + number)
- ✅ **CHAT-04**: Join/leave system notifications
- ✅ **CHAT-05**: Online user list showing all connected users

---

## Known Limitations (Expected Behavior)

1. **No persistence**: Messages disappear on page reload (by design)
2. **No private messaging**: Public chat only (by design)
3. **No user avatars**: Simple text-based list (v2 feature)
4. **No typing indicators**: Not implemented in v1 (v2 feature)
5. **No message history**: New users don't see old messages (v2 feature)

---

## Debugging Tips

### If server won't start:

```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process using port 3000
kill -9 <PID>
```

### If Socket.IO connection fails:

1. Check browser console for errors
2. Check server terminal for connection logs
3. Verify server is running on http://localhost:3000
4. Try different browser/incognito window

### If messages don't appear:

1. Check "Network" tab in DevTools for WebSocket connection (ws://)
2. Verify Socket.IO events are firing (console.log statements)
3. Check server terminal for "Message from [user]" logs

---

## Testing Checklist

Copy this checklist to verify all tests pass:

```
[ ] Test 1: Launch Chat Room Window
[ ] Test 2: Username Generation
[ ] Test 3: Send a Message
[ ] Test 4: Multi-Client Messaging
[ ] Test 5: Join/Leave Notifications
[ ] Test 6: Message History Limit
[ ] Test 7: Timestamp Format
[ ] Test 8: Enter Key Sends Message
[ ] Test 9: Connection Status
[ ] Test 10: Empty Message Prevention
[ ] Test 11: Long Messages
[ ] Test 12: Windows 98 Styling
[ ] Test 13: Auto-Scroll
[ ] Test 14: Notification Sound
[ ] Test 15: Window Management Integration
[ ] Test 16: Multiple Users (Stress Test)
[ ] Test 17: Memory Leak Check
[ ] Test 18: Server Disconnect During Message Send
[ ] Test 19: Network Throttling
```

---

**Phase 5 Testing Complete!** ✅
