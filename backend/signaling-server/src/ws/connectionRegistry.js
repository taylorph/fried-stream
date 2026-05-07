// apps/signaling-server/src/ws/connectionRegistry.js

const connections = new Map();

function addConnection(clientId, ws) {
  connections.set(clientId, ws);
}

function getConnection(clientId) {
  return connections.get(clientId);
}

function removeConnection(clientId) {
  connections.delete(clientId);
}

function hasConnection(clientId) {
  return connections.has(clientId);
}

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