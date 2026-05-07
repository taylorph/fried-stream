// apps/signaling-server/src/security/generateId.js

function generateId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 8)
  );
}

module.exports = {
  generateId,
};

