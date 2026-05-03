# Fried Stream

## Overview

Fried Stream is a real-time WebRTC streaming system built with a custom WebSocket signaling backend.

It enables two clients (sender + receiver) to establish a peer-to-peer video stream through a controlled room-based signaling flow.

---

## Core Features

- Room creation system (receiver-owned rooms)
- Join request / approval / rejection flow
- WebRTC signaling (offer / answer / ICE candidates)
- Live media streaming between peers
- Built-in debug panel for runtime event tracing

---

## Architecture

### Frontend

- `frontend/receiver`
  - Creates rooms
  - Manages join approvals
  - Receives incoming streams

- `frontend/sender`
  - Captures media stream
  - Requests to join rooms
  - Sends WebRTC offers

---

### Backend (Signaling Server)

- WebSocket server (port 8080)
- Handles message routing and room state
- Stateless signaling layer (no media handling)

Key responsibilities:
- routeMessage()
- room creation
- join coordination
- WebRTC signal relay

---

## Message Protocol

All communication uses JSON messages over WebSocket:

### Room Flow
- `create-room`
- `room-created`

### Join Flow
- `request-join`
- `approve-join`
- `reject-join`

### WebRTC Flow
- `offer`
- `answer`
- `ice-candidate`

---

## Message Flow (System Design)

1. Receiver connects → opens WebSocket
2. Receiver clicks "Create Room"
3. Backend creates room and returns:
   - `room-created`
4. Sender requests join:
   - `request-join`
5. Receiver responds:
   - `approve-join` or `reject-join`
6. If approved:
   - WebRTC negotiation starts
   - offer → answer → ICE exchange
7. Peer-to-peer stream established

---

## Debug System (Important Engineering Tool)

A built-in debug panel was implemented directly in the receiver frontend to provide real-time visibility into system behavior.

It acts as a lightweight event tracing layer for the entire system.

### It logs:

- WebSocket connection lifecycle
- Incoming signaling messages
- User interactions (button clicks)
- End-to-end room + WebRTC flow events

### Why it exists:

WebRTC + WebSocket signaling is highly asynchronous and event-driven.

Traditional debugging (console logs only) was insufficient for understanding system state transitions.

This debug panel enables:
- real-time observability
- rapid failure detection
- clear tracing of signaling flow

### Example Events:

- "WebSocket CONNECTED"
- "CREATE ROOM CLICKED"
- "WS MESSAGE: room-created"
- "offer received"

---

## Design Decisions

### 1. String-based message types

We intentionally use raw string message types instead of enums for simplicity and debuggability.

Example:
```js
"type": "create-room"