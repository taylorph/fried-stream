// apps/signaling-server/src/ws/handlers/createRoom.js

const { createRoom } = require("../../rooms/roomService");
const messageTypes = require("../../../../../packages/shared/protocol/messageTypes");

function handleCreateRoom(message, context) {
  const { clientId, ws } = context;

  const room = createRoom(clientId);

  ws.send(
    JSON.stringify({
      type: "room-created",
      code: room.code,
    })
  );
}

module.exports = handleCreateRoom;