const { Server } = require("socket.io");
const {
  emitError,
  updateConnectedClients,
  leaveRoomBySocketID,
  findFreeRoom,
  sendMessage,
} = require("./utils/utilsGeneral");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  let rooms = [];

  io.on("connection", (socket) => {
    updateConnectedClients(io);
    socket.emit("sessionInfo", socket.id);

    socket.on("joinRoom", (userObject) => {
      try {
        let clientIP = socket.handshake.address;
        if (clientIP.includes("::ffff:")) {
          clientIP = clientIP.replace("::ffff:", "");
        }
        Object.assign(userObject, { clientIP });

        findFreeRoom(io, socket, rooms, userObject);
      } catch (err) {
        emitError(socket, "joinRoomError", err.message);
      }
    });

    socket.on("leaveRoom", (callback) => {
      try {
        const roomID = leaveRoomBySocketID(rooms, socket);
        socket.leave(roomID);
        callback();
      } catch (err) {
        emitError(socket, "roomError", err.message);
      }
    });

    socket.on("disconnect", () => {
      try {
        leaveRoomBySocketID(rooms, socket);
        updateConnectedClients(io);
      } catch (err) {
        // TODO: Consider creating a separate file for server logs to improve log management.
        if (err.message !== "Nie udało się opuścić pokoju") {
          console.error(err);
        }
      }
    });

    socket.on("sendMessage", ({ message }) => {
      try {
        let clientIP = socket.handshake.address;
        if (clientIP.includes("::ffff:")) {
          clientIP = clientIP.replace("::ffff:", "");
        }

        sendMessage(io, socket, rooms, message, clientIP);
      } catch (err) {
        emitError(socket, "roomError", err.message);
      }
    });
  });
};
