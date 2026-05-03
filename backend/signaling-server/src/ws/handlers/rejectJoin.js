// apps/signaling-server/src/ws/handlers/rejectJoin.js

const { findRoom } = require("../../rooms/roomService");
const { sendToClient } = require("../connectionRegistry");
const messageTypes = require("../../../../../packages/shared/protocol/messageTypes");

function handleRejectJoin(message, context) {
  const { clientId } = context;
  const { code, requesterId } = message;

  const room = findRoom(code);

  if (!room) {
    console.warn("Cannot reject join. Room not found:", code);
    return;
  }

  if (room.hostId !== clientId) {
    console.warn("Unauthorized rejection attempt by:", clientId);
    return;
  }

  sendToClient(requesterId, {
    type: "join-rejected",
    code,
  });
}

module.exports = handleRejectJoin;