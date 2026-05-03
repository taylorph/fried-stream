const ws = new WebSocket("ws://localhost:8080");

const statusEl = document.getElementById("status");
const input = document.getElementById("roomCodeInput");

ws.onopen = () => {
  statusEl.textContent = "Connected";
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  console.log("Incoming:", msg);

  if (msg.type === "join-approved") {
    statusEl.textContent = "Join approved ✅";
  }

  if (msg.type === "join-rejected") {
    statusEl.textContent = "Join rejected ❌";
  }
};

// Request join
document.getElementById("joinBtn").onclick = () => {
  const code = input.value;

  ws.send(
    JSON.stringify({
      type: "request-join",
      code,
    })
  );
};