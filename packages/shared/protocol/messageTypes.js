// packages/shared/protocol/messageTypes.js

// Connection lifecycle
const CONNECT = "connect";
const DISCONNECT = "disconnect";

// Room lifecycle
const CREATE_ROOM = "create-room";
const ROOM_CREATED = "room-created";

const REQUEST_JOIN = "request-join";
const JOIN_REQUESTED = "join-requested";

const APPROVE_JOIN = "approve-join";
const JOIN_APPROVED = "join-approved";

const REJECT_JOIN = "reject-join";
const JOIN_REJECTED = "join-rejected";

const END_SESSION = "end-session";
const SESSION_ENDED = "session-ended";

// WebRTC signaling
const OFFER = "offer";
const ANSWER = "answer";
const ICE_CANDIDATE = "ice-candidate";

// Error handling
const ERROR = "error";

module.exports = {
  CONNECT,
  DISCONNECT,

  CREATE_ROOM,
  ROOM_CREATED,

  REQUEST_JOIN,
  JOIN_REQUESTED,

  APPROVE_JOIN,
  JOIN_APPROVED,

  REJECT_JOIN,
  JOIN_REJECTED,

  END_SESSION,
  SESSION_ENDED,

  OFFER,
  ANSWER,
  ICE_CANDIDATE,

  ERROR,
};
