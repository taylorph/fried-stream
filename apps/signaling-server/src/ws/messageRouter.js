const messageTypes = require("../../../../packages/shared/protocol/messageTypes");
const handleCreateRoom = require("./handlers/createRoom");
const handleRequestJoin = require("./handlers/requestJoin");
const handleApproveJoin = require("./handlers/approveJoin");
const handleRejectJoin = require("./handlers/rejectJoin");
const handleRelaySignal = require("./handlers/relaySignal");

const handlers = {};

function registerHandler(type, handler) {
  handlers[type] = handler;
}

// Register handlers
registerHandler(messageTypes.CREATE_ROOM, handleCreateRoom);
registerHandler(messageTypes.REQUEST_JOIN, handleRequestJoin);
registerHandler(messageTypes.APPROVE_JOIN, handleApproveJoin);
registerHandler(messageTypes.REJECT_JOIN, handleRejectJoin);

// NEW: WebRTC signaling relay
registerHandler(messageTypes.OFFER, handleRelaySignal);
registerHandler(messageTypes.ANSWER, handleRelaySignal);
registerHandler(messageTypes.ICE_CANDIDATE, handleRelaySignal);

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