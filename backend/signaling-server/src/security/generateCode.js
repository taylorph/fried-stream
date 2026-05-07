// apps/signaling-server/src/security/generateCode.js

function generateCode() {
  const min = 100000; // smallest 6-digit number
  const max = 999999; // largest 6-digit number

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  generateCode,
};
