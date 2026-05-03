// apps/signaling-server/src/security/generateId.js

/**
 * Generates a unique client ID.
 *
 * 
 * Every connected user gets a unique ID.
 *
 * 
 * This function creates a lightweight unique identifier
 * to track client connections within the signaling layer.
 */

function generateId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 8)
  );
}

module.exports = {
  generateId,
};

