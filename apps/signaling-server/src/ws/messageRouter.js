// apps/signaling-server/src/ws/messageRouter.js

const messageTypes = require("../../../../packages/shared/protocol/messageTypes");
const handleCreateRoom = require("./handlers/createRoom");

/**
 * Message Router
 *
 * Human:
 * Decides what to do when a message comes in.
 *
 * Interview:
 * This module implements a dispatcher that maps protocol message types
 * to their respective handler functions, enabling scalable event-driven logic.
 */

const handlers = {};

function registerHandler(type, handler) {
  handlers[type] = handler;
}

// Register handlers
registerHandler(messageTypes.CREATE_ROOM, handleCreateRoom);

function routeMessage(message, context) {
  const handler = handlers[message.type];

  if (!handler) {
    console.warn("No handler for message type:", message.type);
    return;
  }

  handler(message, context);
}

module.exports = {
  registerHandler,
  routeMessage,
};