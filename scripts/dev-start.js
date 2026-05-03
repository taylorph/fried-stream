const { spawn } = require("child_process");

function run(cmd, args, label) {
  const p = spawn(cmd, args, { stdio: "inherit" });
  console.log(`\n[${label}] started`);
  return p;
}

console.log("\n Starting FriedStream...\n");

// Start signaling server
run("node", ["apps/signaling-server/src/index.js"], "SIGNALING");

// Start static server
run("npx", ["serve", "."], "STATIC");

// Open UI after delay
setTimeout(() => {
  run("open", [
    "http://localhost:3000/apps/receiver-web/public/index.html"
  ], "RECEIVER");

  run("open", [
    "http://localhost:3000/apps/sender-web/public/index.html"
  ], "SENDER");
}, 3000);
