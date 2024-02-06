"use strict";

const ChatModel = require("../../models/chatModel");
const { findRoomBySocketID, getClientIP } = require("./helperFunctions");
const { messageSchema } = require("../schemas/messageSchema");

function emitError(socket, errorTitle, message) {
  socket.emit(errorTitle, message);
}

async function updateConnectedClients(io) {
  const sockets = await io.fetchSockets();
  const connectedClients = sockets.map((socket) => socket.id);

  io.emit("connectedClients", connectedClients.length);
}

module.exports = {
  emitError,
  updateConnectedClients,
};
