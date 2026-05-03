import {
  initReceiverConnection,
  handleOffer,
  handleIceCandidate,
} from "./webrtc/peerConnection.js";

const ws = new WebSocket("ws://localhost:8080");

let currentRoomCode = null;
let lastRequesterId = null;

const roomCodeEl = document.getElementById("roomCode");
const statusEl = document.getElementById("status");
const requesterEl = document.getElementById("requester");
const remoteVideo = document.getElementById("remoteVideo");

ws.onopen = () => {
  statusEl.textContent = "Connected";
  initReceiverConnection(ws, remoteVideo);
};

ws.onmessage = async (event) => {
  const msg = JSON.parse(event.data);
  console.log("Incoming:", msg);

  if (msg.type === "room-created") {
    currentRoomCode = msg.code;
    roomCodeEl.textContent = msg.code;
  }

  if (msg.type === "join-requested") {
    lastRequesterId = msg.requesterId;
    requesterEl.textContent = msg.requesterId;
  }

  if (msg.type === "offer") {
    await handleOffer(msg.offer, msg.fromId);
    statusEl.textContent = "Receiving stream";
  }

  if (msg.type === "ice-candidate") {
    await handleIceCandidate(msg.candidate);
  }
};

document.getElementById("createRoomBtn").onclick = () => {
  ws.send(JSON.stringify({ type: "create-room" }));
};

document.getElementById("approveBtn").onclick = () => {
  if (!currentRoomCode || !lastRequesterId) return;

  ws.send(JSON.stringify({
    type: "approve-join",
    code: currentRoomCode,
    requesterId: lastRequesterId,
  }));

  statusEl.textContent = "Approved sender";
};

document.getElementById("rejectBtn").onclick = () => {
  if (!currentRoomCode || !lastRequesterId) return;

  ws.send(JSON.stringify({
    type: "reject-join",
    code: currentRoomCode,
    requesterId: lastRequesterId,
  }));

  statusEl.textContent = "Rejected sender";
};
