// apps/signaling-server/src/security/generateCode.js

/**
 * Generates a 6-digit room code.
 *
 * 
 * This is the code the receiver shows to the sender.
 *
 * 
 * This function generates a bounded random numeric identifier
 * used as a short-lived access key for session pairing.
 */

function generateCode() {
  const min = 100000; // smallest 6-digit number
  const max = 999999; // largest 6-digit number

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  generateCode,
};
