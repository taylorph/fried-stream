# FriedStream Demo Script

## Project Summary

FriedStream is a browser-based, AirPlay-inspired screen streaming prototype. It uses:
- WebSockets for signaling
- WebRTC for peer-to-peer video streaming

## Demo Flow

1. Start signaling server
node apps/signaling-server/src/index.js

2. Start static file server
python3 -m http.server 5173

3. Open receiver
http://localhost:5173/apps/receiver-web/public/index.html

4. Open sender
http://localhost:5173/apps/sender-web/public/index.html

5. Click "Create Room" on receiver

6. Enter code on sender and click "Request Join"

7. Approve on receiver

8. Click "Start Screen Stream" on sender

Expected:
- Receiver sees live screen feed
