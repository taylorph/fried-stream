// apps/signaling-server/src/ws/handlers/approveJoin.js

const { findRoom } = require("../../rooms/roomService");
const { sendToClient } = require("../connectionRegistry");
const messageTypes = require("../../../../../packages/shared/protocol/messageTypes");

function handleApproveJoin(message, context) {
  const { clientId } = context;
  const { code, requesterId } = message;

  const room = findRoom(code);

  if (!room) {
    console.warn("Cannot approve join. Room not found:", code);
    return;
  }

  if (room.hostId !== clientId) {
    console.warn("Unauthorized approval attempt by:", clientId);
    return;
  }

  room.clientId = requesterId;
  room.approved = true;

  sendToClient(requesterId, {
    type: messageTypes.JOIN_APPROVED,
    code,
  });
}

module.exports = handleApproveJoin;