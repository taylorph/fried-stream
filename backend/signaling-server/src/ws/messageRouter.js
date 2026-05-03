const handleCreateRoom = require("./handlers/createRoom");
const handleRequestJoin = require("./handlers/requestJoin");
const handleApproveJoin = require("./handlers/approveJoin");
const handleRejectJoin = require("./handlers/rejectJoin");
const handleRelaySignal = require("./handlers/relaySignal");

const handlers = {};

function registerHandler(type, handler) {
  handlers[type] = handler;
}

// Register handlers (ALL STRING-BASED, CONSISTENT)
registerHandler("create-room", handleCreateRoom);
registerHandler("request-join", handleRequestJoin);
registerHandler("approve-join", handleApproveJoin);
registerHandler("reject-join", handleRejectJoin);

// WebRTC signaling relay
registerHandler("offer", handleRelaySignal);
registerHandler("answer", handleRelaySignal);
registerHandler("ice-candidate", handleRelaySignal);

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