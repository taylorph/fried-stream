// apps/signaling-server/src/ws/handlers/requestJoin.js

const { findRoom, isRoomExpired } = require("../../rooms/roomService");
const { sendToClient } = require("../connectionRegistry");
const messageTypes = require("../../../../../packages/shared/protocol/messageTypes");

/**
 * Handle join request.
 *
 * Human:
 * Someone enters a room code and asks the receiver for permission.
 *
 * Interview:
 * This handler validates the room lookup and expiration state before forwarding
 * the access request to the host, preserving the approval-based security model.
 */
function handleRequestJoin(message, context) {
  const { clientId } = context;
  const { code } = message;

  const room = findRoom(String(code));

  if (!room) {
    console.warn("Room not found for code:", code);
    return;
  }

  if (isRoomExpired(room)) {
    console.warn("Room expired for code:", code);
    return;
  }

  sendToClient(room.hostId, {
    type: "join-requested",
    code: room.code,
    requesterId: clientId,
  });
}

module.exports = handleRequestJoin;