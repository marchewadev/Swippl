const { Server } = require("socket.io");

const { emitError, updateConnectedClients } = require("./utils/utilsGeneral");
const {
  leaveRoomBySocketID,
  findFreeRoom,
  sendMessage,
} = require("./utils/utilsRoom");
const {
  getChatHistory,
  sendPrivateMessage,
  createUserSession,
  toggleOnlineStatus,
} = require("./utils/utilsPrivateRoom");
const {
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
} = require("./utils/utilsFriendStatus");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  let rooms = [];
  let privateRooms = [];

  io.on("connection", (socket) => {
    updateConnectedClients(io);
    socket.emit("sessionInfo", socket.id);

    socket.on("joinRoom", async (userObject) => {
      try {
        await findFreeRoom(io, socket, rooms, userObject);
      } catch (err) {
        emitError(socket, "joinRoomError", err.message);
      }
    });

    socket.on("leaveRoom", async (callback) => {
      try {
        const roomID = await leaveRoomBySocketID(socket, rooms);
        socket.leave(roomID);
        callback();
      } catch (err) {
        emitError(socket, "roomError", err.message);
      }
    });

    socket.on("disconnect", async () => {
      try {
        if (socket.data.userID) {
          await toggleOnlineStatus(privateRooms, socket.data.userID);
        }

        await leaveRoomBySocketID(socket, rooms);
        updateConnectedClients(io);
      } catch (err) {
        // TODO: Consider creating a separate file for server logs to improve log management.
        if (err.message !== "Nie udało się opuścić pokoju") {
          console.error(err);
        }
      }
    });

    socket.on("sendMessage", async ({ message }) => {
      try {
        await sendMessage(io, socket, rooms, message);
      } catch (err) {
        emitError(socket, "roomError", err.message);
      }
    });

    socket.on("sendFriendRequest", async () => {
      try {
        await sendFriendRequest(io, socket, rooms);
      } catch (err) {
        emitError(socket, "roomError", err.message);
      }
    });

    socket.on("acceptFriendRequest", async () => {
      try {
        await acceptFriendRequest(io, socket, rooms);
      } catch (err) {
        emitError(socket, "roomError", err.message);
      }
    });

    socket.on("removeFriend", async (sessionObject, callback) => {
      try {
        await removeFriend(socket, privateRooms, sessionObject);
        callback();
      } catch (err) {
        emitError(socket, "roomError", err.message);
      }
    });

    socket.on("createUserSession", async (sessionObject) => {
      try {
        await createUserSession(io, socket, privateRooms, sessionObject);
        socket.data = { userID: sessionObject.userID };
      } catch (err) {
        emitError(socket, "roomError", err.message);
      }
    });

    socket.on("getChatHistory", async (chatObject, callback) => {
      try {
        const chatHistory = await getChatHistory(chatObject);
        callback(chatHistory);
      } catch (err) {
        emitError(socket, "joinRoomError", err.message);
      }
    });

    socket.on("sendPrivateMessage", async (messageObject) => {
      try {
        await sendPrivateMessage(io, socket, privateRooms, messageObject);
      } catch (err) {
        emitError(socket, "roomError", err.message);
      }
    });
  });
};
