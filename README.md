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

---

## QA / System Verification

This section defines how to validate that the system works end-to-end.

### 1. Receiver Flow (Room Creation)

- Open receiver client
- Click "Create Room"
- Expected:
  - WebSocket connects successfully
  - Room code appears
  - Backend logs room creation event

### 2. Sender Join Flow

- Open sender client
- Enter room code
- Request to join room
- Expected:
  - Receiver sees join request
  - Requester ID appears in UI

### 3. Approval Flow

- Receiver clicks "Approve"
- Expected:
  - Sender receives approval
  - WebRTC negotiation starts

### 4. WebRTC Connection

- After approval:
  - Offer → Answer exchange occurs
  - ICE candidates are exchanged
  - Peer connection is established

### 5. Media Streaming

- Sender starts stream
- Receiver video element should display live feed
- Expected:
  - Low latency peer-to-peer video
  - No server media handling

---

## Failure Cases to Watch

- Room created but sender cannot join → signaling mismatch
- Join request appears but approval does nothing → missing handler binding
- Offer sent but no video → ICE failure or peer connection issue
- WebSocket connects but no events → script path/module load issue

---

## Debug Tools Used

- In-app debug panel for receiver
- Console logs for sender
- WebSocket server logs for signaling flow tracing