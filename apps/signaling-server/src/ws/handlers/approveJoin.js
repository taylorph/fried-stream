const { findRoom, approveViewer } = require("../../rooms/roomService");
const { sendToClient } = require("../connectionRegistry");
const messageTypes = require("../../../../../packages/shared/protocol/messageTypes");

function handleApproveJoin(message, context) {
  const { clientId } = context;
  const { code, requesterId } = message;

  const room = findRoom(String(code));

  if (!room) {
    console.warn("Cannot approve join. Room not found:", code);
    return;
  }

  if (room.hostId !== clientId) {
    console.warn("Unauthorized approval attempt by:", clientId);
    return;
  }

  approveViewer(room, requesterId);

  sendToClient(requesterId, {
    type: messageTypes.JOIN_APPROVED,
    code,
    hostId: room.hostId,
  });

  console.log(`Approved viewer ${requesterId} for room ${code}`);
}

module.exports = handleApproveJoin;
