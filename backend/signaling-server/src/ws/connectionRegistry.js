// apps/signaling-server/src/ws/connectionRegistry.js

/**
 * Connection Registry
 *
 * 
 * Keeps track of all connected users and their WebSocket connections.
 *
 * 
 * This module maintains an in-memory mapping between client IDs and their
 * active WebSocket connections, enabling efficient message routing
 * in a real-time signaling system.
 */

const connections = new Map();

/**
 * Register a new connection
 */
function addConnection(clientId, ws) {
  connections.set(clientId, ws);
}

/**
 * Get a connection by client ID
 */
function getConnection(clientId) {
  return connections.get(clientId);
}

/**
 * Remove a connection
 */
function removeConnection(clientId) {
  connections.delete(clientId);
}

/**
 * Check if a client is connected
 */
function hasConnection(clientId) {
  return connections.has(clientId);
}

/**
 * Send a message to a specific client
 */
function sendToClient(clientId, message) {
  const ws = connections.get(clientId);

  if (!ws) return;

  try {
    ws.send(JSON.stringify(message));
  } catch (err) {
    console.error("Failed to send message:", err);
  }
}

module.exports = {
  addConnection,
  getConnection,
  removeConnection,
  hasConnection,
  sendToClient,
};