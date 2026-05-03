// apps/signaling-server/src/rooms/roomStore.js

/**
 * In-memory room storage.
 *
 * 
 * This keeps track of active rooms while the server is running.
 *
 * 
 * This module abstracts room persistence behind a small API. For the MVP,
 * we use a JavaScript Map as an in-memory store, giving average-case O(1)
 * insert, lookup, and delete operations by room code.
 */

const roomsByCode = new Map();

function saveRoom(room) {
  roomsByCode.set(room.code, room);
  return room;
}

function getRoomByCode(code) {
  return roomsByCode.get(code);
}

function deleteRoomByCode(code) {
  return roomsByCode.delete(code);
}

function hasRoom(code) {
  return roomsByCode.has(code);
}

function getAllRooms() {
  return Array.from(roomsByCode.values());
}

function clearRooms() {
  roomsByCode.clear();
}

module.exports = {
  saveRoom,
  getRoomByCode,
  deleteRoomByCode,
  hasRoom,
  getAllRooms,
  clearRooms,
};
