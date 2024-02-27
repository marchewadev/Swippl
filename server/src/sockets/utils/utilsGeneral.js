"use strict";

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
