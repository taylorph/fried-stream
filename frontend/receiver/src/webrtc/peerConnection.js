let pc;
let ws;

export function initReceiverConnection(socket, videoElement) {
  ws = socket;

  pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  pc.ontrack = (event) => {
    videoElement.srcObject = event.streams[0];
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      ws.send(
        JSON.stringify({
          type: "ice-candidate",
          targetId: window.senderId,
          candidate: event.candidate,
        })
      );
    }
  };
}

export async function handleOffer(offer, senderId) {
  window.senderId = senderId;

  await pc.setRemoteDescription(offer);

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  ws.send(
    JSON.stringify({
      type: "answer",
      targetId: senderId,
      answer,
    })
  );
}

export async function handleIceCandidate(candidate) {
  await pc.addIceCandidate(candidate);
}