const ws = new WebSocket("ws://localhost:8080");

let currentRoomCode = null;
let lastRequesterId = null;

const roomCodeEl = document.getElementById("roomCode");
const statusEl = document.getElementById("status");
const requesterEl = document.getElementById("requester");

ws.onopen = () => {
  statusEl.textContent = "Connected";
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  console.log("Incoming:", msg);

  if (msg.type === "connect") {
    statusEl.textContent = "Connected (ID assigned)";
  }

  if (msg.type === "room-created") {
    currentRoomCode = msg.code;
    roomCodeEl.textContent = msg.code;
  }

  if (msg.type === "join-requested") {
    lastRequesterId = msg.requesterId;
    requesterEl.textContent = msg.requesterId;
  }
};

// Create room
document.getElementById("createRoomBtn").onclick = () => {
  ws.send(JSON.stringify({ type: "create-room" }));
};

// Approve
document.getElementById("approveBtn").onclick = () => {
  if (!currentRoomCode || !lastRequesterId) return;

  ws.send(
    JSON.stringify({
      type: "approve-join",
      code: currentRoomCode,
      requesterId: lastRequesterId,
    })
  );
};

// Reject
document.getElementById("rejectBtn").onclick = () => {
  if (!currentRoomCode || !lastRequesterId) return;

  ws.send(
    JSON.stringify({
      type: "reject-join",
      code: currentRoomCode,
      requesterId: lastRequesterId,
    })
  );
};