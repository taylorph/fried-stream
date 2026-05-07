import {
  initSenderConnection,
  createOffer,
  handleAnswer,
  handleIceCandidate,
} from "./webrtc/peerConnection.js";

const ws = new WebSocket("ws://localhost:8080");

let receiverId = null;
let localStream = null;

const statusEl = document.getElementById("status");
const input = document.getElementById("roomCodeInput");
const localVideo = document.getElementById("localVideo");

ws.onopen = () => {
  statusEl.textContent = "Connected";
  initSenderConnection(ws);
};

ws.onmessage = async (event) => {
  const msg = JSON.parse(event.data);
  console.log("Incoming:", msg);

  if (msg.type === "join-approved") {
    statusEl.textContent = "Join approved. Ready to stream.";
    receiverId = msg.hostId || msg.fromId;
  }

  if (msg.type === "join-rejected") {
    statusEl.textContent = "Join rejected";
  }

  if (msg.type === "answer") {
    await handleAnswer(msg.answer);
    statusEl.textContent = "Streaming connection established";
  }

  if (msg.type === "ice-candidate") {
    await handleIceCandidate(msg.candidate);
  }
};

document.getElementById("joinBtn").onclick = () => {
  const code = input.value.trim();

  ws.send(JSON.stringify({
    type: "request-join",
    code,
  }));

  statusEl.textContent = "Join requested";
};

document.getElementById("startStreamBtn").onclick = async () => {
  if (!receiverId) {
    statusEl.textContent = "No approved receiver yet";
    return;
  }

  localStream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      frameRate: { ideal: 30, max: 60 },
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
    audio: true,
  });

  localVideo.srcObject = localStream;

  await createOffer(localStream, receiverId);
  statusEl.textContent = "Screen stream offer sent";
};