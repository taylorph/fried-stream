// apps/signaling-server/src/ws/handlers/requestJoin.js

const roomStore = require("../../rooms/roomStore");
const { sendToClient } = require("../connectionRegistry");
const messageTypes = require("../../../../../packages/shared/protocol/messageTypes");

/**
 * Handle join request
 *
 * Human:
 * Someone enters a code and wants to connect.
 *
 * Interview:
 * This handler validates the existence of a room and forwards a join request
 * to the room owner, enabling an approval-based connection model.
 */
function handleRequestJoin(message, context) {
  const { clientId } = context;
  const { code } = message;

  const room = roomStore.getRoom(code);

  if (!room) {
    console.warn("Room not found for code:", code);
    return;
  }

  // Notify room owner (receiver)
  sendToClient(room.ownerId, {
    type: messageTypes.JOIN_REQUEST,
    requesterId: clientId,
  });
}

module.exports = handleRequestJoin;