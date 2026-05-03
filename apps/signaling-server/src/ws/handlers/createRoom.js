// apps/signaling-server/src/ws/handlers/createRoom.js

const { createRoom } = require("../../rooms/roomService");
const messageTypes = require("../../../../../packages/shared/protocol/messageTypes");

/**
 * Handle room creation
 *
 * Human:
 * When a receiver asks for a room, we create one and send back a code.
 *
 * Interview:
 * This handler processes a room creation request and responds with a
 * session identifier, enabling clients to initiate a pairing workflow.
 */
function handleCreateRoom(message, context) {
  const { clientId, ws } = context;

  const room = createRoom(clientId);

  ws.send(
    JSON.stringify({
      type: messageTypes.ROOM_CREATED,
      code: room.code,
    })
  );
}

module.exports = handleCreateRoom;