// apps/signaling-server/dev/testClient.js

const WebSocket = require("ws");
const readline = require("readline");

// =============================
// STATE
// =============================
let ws;
let clientId = null;
let currentRoomCode = null;
let lastRequesterId = null;
let waitingForInput = false;

// =============================
// READLINE
// =============================
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// =============================
// CONNECT TO SERVER
// =============================
function connect() {
  ws = new WebSocket("ws://localhost:8080");

  ws.on("open", () => {
    console.log("\n✅ Connected to signaling server");
    showMenu();
  });

  ws.on("message", (data) => {
    const msg = JSON.parse(data);

    console.log("\n📩 Incoming:", msg);

    if (msg.type === "connect") {
      clientId = msg.clientId;
      console.log(`🆔 Assigned client ID: ${clientId}`);
    }

    if (msg.type === "room-created") {
      currentRoomCode = msg.code;
      console.log(`🎯 Room created: ${currentRoomCode}`);
    }

    if (msg.type === "join-requested") {
      lastRequesterId = msg.requesterId;
      currentRoomCode = msg.code;
      console.log(`🚨 Join request from: ${lastRequesterId}`);
    }

    if (msg.type === "join-approved") {
      currentRoomCode = msg.code;
      console.log("✅ Join approved! Ready to connect.");
    }

    if (msg.type === "join-rejected") {
      console.log(" Join rejected.");
    }

    showMenu();
  });

  ws.on("close", () => {
    console.log("\n Disconnected from server");
    process.exit(0);
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err.message);
  });
}

// =============================
// SEND MESSAGE
// =============================
function send(msg) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.log("⚠ Not connected");
    return;
  }

  ws.send(JSON.stringify(msg));
}

// =============================
// MENU
// =============================
function showMenu() {
  if (waitingForInput) return;

  waitingForInput = true;

  console.log(`
========= FriedStream CLI =========

Client ID: ${clientId || "N/A"}
Room Code: ${currentRoomCode || "N/A"}
Last Requester: ${lastRequesterId || "N/A"}

1. Create Room (Receiver)
2. Request Join (Sender)
3. Approve Join
4. Reject Join
5. Show State
6. Exit

===================================
`);

  rl.question("Select option: ", (answer) => {
    waitingForInput = false;
    handleInput(answer);
  });
}

// =============================
// INPUT HANDLER
// =============================
function handleInput(input) {
  const choice = input.trim();

  switch (choice) {
    case "1":
      send({ type: "create-room" });
      break;

    case "2":
      rl.question("Enter room code: ", (code) => {
        send({
          type: "request-join",
          code: code.trim(),
        });

        setTimeout(showMenu, 300);
      });
      return;

    case "3":
      if (!currentRoomCode || !lastRequesterId) {
        console.log("⚠ Missing room or requester");
      } else {
        send({
          type: "approve-join",
          code: currentRoomCode,
          requesterId: lastRequesterId,
        });
      }
      break;

    case "4":
      if (!currentRoomCode || !lastRequesterId) {
        console.log("⚠ Missing room or requester");
      } else {
        send({
          type: "reject-join",
          code: currentRoomCode,
          requesterId: lastRequesterId,
        });
      }
      break;

    case "5":
      console.log({
        clientId,
        currentRoomCode,
        lastRequesterId,
      });
      break;

    case "6":
      console.log("👋 Exiting...");
      process.exit(0);

    default:
      console.log("Invalid choice");
  }

  setTimeout(showMenu, 300);
}

// =============================
// START
// =============================
connect();