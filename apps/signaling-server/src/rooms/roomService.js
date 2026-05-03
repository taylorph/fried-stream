// apps/signaling-server/src/rooms/roomService.js
const { ROOM_CODE_TTL_MS } = require("../../../../packages/shared/constants/timeouts");

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
    expiresAt: Date.now() + ROOM_CODE_TTL_MS,
  };

  return saveRoom(room);
}

function findRoom(code) {
  return getRoomByCode(code);
}

function isRoomExpired(room) {
  return Date.now() > room.expiresAt;
}

function addViewer(room, viewerId) {
  room.viewers.add(viewerId);
}

function approveViewer(room, viewerId) {
  room.approvedViewers.add(viewerId);
}

function isViewerApproved(room, viewerId) {
  return room.approvedViewers.has(viewerId);
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
