let pc;
let ws;

export function initSenderConnection(socket) {
  ws = socket;

  pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      ws.send(
        JSON.stringify({
          type: "ice-candidate",
          targetId: window.receiverId,
          candidate: event.candidate,
        })
      );
    }
  };
}

export async function createOffer(stream, receiverId) {
  window.receiverId = receiverId;

  stream.getTracks().forEach((track) => {
    pc.addTrack(track, stream);
  });

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  ws.send(
    JSON.stringify({
      type: "offer",
      targetId: receiverId,
      offer,
    })
  );
}

export async function handleAnswer(answer) {
  await pc.setRemoteDescription(answer);
}

export async function handleIceCandidate(candidate) {
  await pc.addIceCandidate(candidate);
}