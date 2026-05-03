const { sendToClient } = require("../connectionRegistry");

function handleRelaySignal(message, context) {
  const { clientId } = context;
  const { targetId, type } = message;

  if (!targetId) {
    console.warn("Cannot relay signal. Missing targetId.");
    return;
  }

  sendToClient(targetId, {
    ...message,
    fromId: clientId,
    type,
  });

  console.log(`Relayed ${type} from ${clientId} to ${targetId}`);
}

module.exports = handleRelaySignal;