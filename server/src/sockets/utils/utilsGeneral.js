"use strict";

const { v4: uuidv4 } = require("uuid");
const ChatModel = require("../../models/chatModel");
const {
  areUsersCompatible,
  getUserDataObject,
  createSession,
} = require("./helperFunctions");
const { messageSchema } = require("../schemas/messageSchema");
const { userDataSchema } = require("../schemas/userSchema");
const { anonDataSchema } = require("../schemas/anonSchema");

function emitError(socket, errorTitle, message) {
  socket.emit(errorTitle, message);
}

async function updateConnectedClients(io) {
  const sockets = await io.fetchSockets();
  const connectedClients = sockets.map((socket) => socket.id);

  io.emit("connectedClients", connectedClients.length);
}

function findRoomBySocketID(rooms, socket) {
  const room = rooms.find((room) =>
    room.users.some((user) => user.id === socket.id)
  );

  return room;
}

function leaveRoomBySocketID(rooms, socket) {
  try {
    let room = findRoomBySocketID(rooms, socket);

    if (!room) {
      throw new Error("Nie udało się opuścić pokoju");
    }

    const roomID = room.id;

    // Remove the user from the room
    room.users = room.users.filter((user) => user.id !== socket.id);

    // If there are no users left in the room, delete the room
    if (room.users.length < 1) {
      let roomIndex = rooms.findIndex((room) => room.id === roomID);
      if (roomIndex !== -1) {
        rooms.splice(roomIndex, 1);
      }
    } else {
      // Emit an event to all users in the room with the updated user count, except the user that left
      socket.to(roomID).emit("roomData", {
        userCount: room.users.length,
      });

      // Emit an event to all users in the room that the other user has disconnected, except the user that left
      socket.to(roomID).emit("userDisconnected", {
        content: "Twój rozmówca się rozłączył",
        type: "admin",
      });

      // Close the chat session inside of the database
      const sessionID = room.sessionID;
      ChatModel.closeSession(sessionID);
    }

    return roomID;
  } catch (err) {
    throw new Error(err.message);
  }
}

function findFreeRoom(io, socket, rooms, userObject) {
  try {
    // First, validate the user object
    if (userObject.token) {
      userDataSchema.validateSync(userObject);
    } else {
      anonDataSchema.validateSync(userObject);
      Object.assign(userObject, { name: "Anonim" });
    }

    // Find a room that is open and has only one user
    let room = rooms.find((room) => {
      if (room.isRoomOpen && room.users.length === 1) {
        const otherUser = room.users.find((user) => user.id !== socket.id);
        return otherUser && areUsersCompatible(userObject, otherUser);
      }
      return false;
    });

    if (!room) {
      room = {
        id: uuidv4(),
        users: [{ id: socket.id, ...userObject }],
        isRoomOpen: true,
        sessionID: null,
      };
      rooms.push(room);
    } else {
      room.users.push({ id: socket.id, ...userObject });
      room.isRoomOpen = false;

      // Create a new chat session inside of the database
      const sessionObject = {
        firstUserID: room.users[0].userID,
        secondUserID: room.users[1].userID,
        firstUserIP: room.users[0].clientIP,
        secondUserIP: room.users[1].clientIP,
      };

      ChatModel.createNewSession(sessionObject)
        .then((sessionID) => {
          Object.assign(room, { sessionID });
        })
        .catch((err) => {
          // TODO: poprawić obsługę błędu, może dodawać to do logów?
          console.error(err);
        });
    }

    socket.join(room.id);

    const stranger = room.users.find((user) => user.id !== socket.id);

    // TODO: do przebudowy może, coś mi tutaj nie pasuje, działać działa, ale... nie wiem
    if (stranger) {
      socket.emit("strangerData", getUserDataObject(stranger));
      io.to(stranger.id).emit("strangerData", getUserDataObject(userObject));
    }

    // Emit an event to all users in the room with the updated user count
    io.to(room.id).emit("roomData", {
      userCount: room.users.length,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}

function sendMessage(io, socket, rooms, message, clientIP) {
  try {
    messageSchema.validateSync({ message });

    const room = findRoomBySocketID(rooms, socket);

    if (!room) {
      throw new Error(
        "Nie znaleziono pokoju, do którego można wysłać wiadomość"
      );
    }

    const user = room.users.find((user) => user.id === socket.id);

    // Save the message to the database
    const sessionObject = {
      sessionID: room.sessionID,
      senderID: typeof user.userID === "undefined" ? null : user.userID,
      senderIP: clientIP,
      message,
    };
    ChatModel.saveMessageToDatabase(sessionObject);

    io.to(room.id).emit("generateMessage", {
      content: message,
      senderID: socket.id,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  emitError,
  updateConnectedClients,
  findRoomBySocketID,
  leaveRoomBySocketID,
  findFreeRoom,
  sendMessage,
};
