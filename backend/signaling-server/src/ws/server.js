// apps/signaling-server/src/ws/server.js

const WebSocket = require("ws");

const { generateId } = require("../security/generateId");
const {
  addConnection,
  removeConnection,
} = require("./connectionRegistry");
const { routeMessage } = require("./messageRouter");

/**
 * Start WebSocket server.
 *
 * Human:
 * Starts the backend and listens for browser/device connections.
 *
 * Interview:
 * Establishes persistent WebSocket connections, assigns client identities,
 * registers active sockets, and delegates message handling to the router.
 */
function startServer(port = 8080) {
  const wss = new WebSocket.Server({ port });

  console.log(`WebSocket server running on port ${port}`);

  wss.on("connection", (ws) => {
    const clientId = generateId();

    console.log("New client connected:", clientId);

    addConnection(clientId, ws);

    ws.send(
      JSON.stringify({
        type: "connect",
        clientId,
      })
    );

    ws.on("message", (data) => {
    console.log("RECEIVED RAW:", data.toString());
    let message;

    try {
        message = JSON.parse(data);
    } catch (err) {
        console.warn("❌ Invalid JSON received:", data.toString());
        return; // DO NOT CRASH
    }

    if (!message || typeof message !== "object" || !message.type) {
        console.warn("❌ Invalid message format:", message);
        return; // DO NOT CRASH
    }

    try {
        routeMessage(message, {
        clientId,
        ws,
        });
    } catch (err) {
        console.error("❌ Handler error:", err.message);
    }
    });

    ws.on("close", () => {
      console.log("Client disconnected:", clientId);
      removeConnection(clientId);
    });
  });
}

module.exports = {
  startServer,
};