const ws = new WebSocket("ws://localhost:8080");

let currentRoomCode = null;
let lastRequesterId = null;

const statusEl = document.getElementById("status");
const roomCodeEl = document.getElementById("roomCode");
const requesterEl = document.getElementById("requester");

ws.onopen = () => {
  statusEl.textContent = "Connected to server";
};

ws.onmessage = (event) => {
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
