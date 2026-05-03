// apps/signaling-server/src/rooms/roomService.js

const { ROOM_CODE_TTL_MS } = require("../../../../packages/shared/constants/timeouts");
const { generateCode } = require("../security/generateCode");
const {
  saveRoom,
  getRoomByCode,
  deleteRoomByCode,
} = require("./roomStore");

function createRoom(hostId) {
  const code = String(generateCode());

  const room = {
    code,
    hostId,

    viewers: new Set(),
    approvedViewers: new Set(),

    createdAt: Date.now(),
    expiresAt: Date.now() + ROOM_CODE_TTL_MS,
  };

  return saveRoom(room);
}

function findRoom(code) {
  return getRoomByCode(String(code));
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
  return deleteRoomByCode(String(code));
}

module.exports = {
  createRoom,
  findRoom,
  isRoomExpired,
  addViewer,
  approveViewer,
  isViewerApproved,
  removeRoom,
};