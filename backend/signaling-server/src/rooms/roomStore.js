// apps/signaling-server/src/rooms/roomStore.js

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
