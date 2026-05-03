// apps/signaling-server/src/rooms/roomService.js

const { generateCode } = require("../security/generateCode");
const {
  saveRoom,
  getRoomByCode,
  deleteRoomByCode,
} = require("./roomStore");

/**
 * Creates a temporary room owned by a receiver.
 *
 * Human:
 * When a receiver opens the app, this creates the room and pairing code.
 *
 * Interview:
 * This function encapsulates room creation business logic, keeping room state
 * management separate from the WebSocket transport layer.
 */
function createRoom(hostId) {
  const code = String(generateCode());

  const room = {
    code,
    hostId,
    clientId: null,
    approved: false,
    createdAt: Date.now(),
    expiresAt: Date.now() + 2 * 60 * 1000,
  };

  return saveRoom(room);
}

function findRoom(code) {
  return getRoomByCode(code);
}

function isRoomExpired(room) {
  return Date.now() > room.expiresAt;
}

function removeRoom(code) {
  return deleteRoomByCode(code);
}

module.exports = {
  createRoom,
  findRoom,
  isRoomExpired,
  removeRoom,
};
