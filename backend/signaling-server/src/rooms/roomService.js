// apps/signaling-server/src/rooms/roomService.js

// =========================
// IMPORTS (leave untouched)
// =========================
const { ROOM_CODE_TTL_MS } = require("../../../../packages/shared/constants/timeouts");
const { generateCode } = require("../security/generateCode");
const {
  saveRoom,
  getRoomByCode,
  deleteRoomByCode,
} = require("./roomStore");

// =========================
// SAFETY HELPER (ADD THIS BLOCK)
// prevents runtime crashes from undefined Sets
// =========================
function ensureRoom(room) {
  if (!room) return;

  if (!room.viewers) room.viewers = new Set();
  if (!room.approvedViewers) room.approvedViewers = new Set();
}

// =========================
// CORE: ROOM CREATION
// =========================
function createRoom(hostId) {
  const code = String(generateCode());

  const room = {
    code,
    hostId,

    // IMPORTANT: initialize sets here (source of your bug fix)
    viewers: new Set(),
    approvedViewers: new Set(),

    createdAt: Date.now(),
    expiresAt: Date.now() + ROOM_CODE_TTL_MS,
  };

  return saveRoom(room);
}

// =========================
// ROOM LOOKUP
// =========================
function findRoom(code) {
  const room = getRoomByCode(String(code));

  // SAFETY: normalize room before returning
  ensureRoom(room);

  return room;
}

// =========================
// EXPIRATION CHECK
// =========================
function isRoomExpired(room) {
  return Date.now() > room.expiresAt;
}

// =========================
// VIEWER TRACKING
// =========================
function addViewer(room, viewerId) {
  ensureRoom(room);
  room.viewers.add(viewerId);
}

// =========================
// APPROVAL SYSTEM
// =========================
function approveViewer(room, viewerId) {
  ensureRoom(room);
  room.approvedViewers.add(viewerId);
}

// =========================
// CHECK APPROVAL STATE
// =========================
function isViewerApproved(room, viewerId) {
  ensureRoom(room);
  return room.approvedViewers.has(viewerId);
}

// =========================
// ROOM DELETION
// =========================
function removeRoom(code) {
  return deleteRoomByCode(String(code));
}

// =========================
// EXPORTS (leave untouched)
// =========================
module.exports = {
  createRoom,
  findRoom,
  isRoomExpired,
  addViewer,
  approveViewer,
  isViewerApproved,
  removeRoom,
};