"use strict";

const { v4: uuidv4 } = require("uuid");
const ChatModel = require("../../models/chatModel");
const { userDataSchema } = require("../schemas/userSchema");
const { anonDataSchema } = require("../schemas/anonSchema");
const {
  areUsersCompatible,
  getUserDataObject,
  findRoomBySocketID,
  getClientIP,
} = require("./helperFunctions");

async function leaveRoomBySocketID(socket, rooms) {
  try {
    let room = findRoomBySocketID(socket, rooms);
    if (!room) {
      // throw new Error("Nie udało się opuścić pokoju");
      // If the room is not found, exit the function without taking any action
      return;
    }

    // Save the room ID so we can use it later to compare
    const roomID = room.id;

    // Remove the user from the room
    room.users = room.users.filter((user) => user.id !== socket.id);

    // If there are no users left in the room, delete the room
    if (room.users.length < 1) {
      let roomIndex = rooms.findIndex((room) => room.id === roomID);
      rooms.splice(roomIndex, 1);
    } else {
      // If there is still a user in the room, emit an event with the updated user count
      socket.to(roomID).emit("roomData", {
        userCount: room.users.length,
      });

      // If there is still a user in the room, emit an event to inform him that his conversation partner has left
      socket.to(roomID).emit("generateMessage", {
        content: "Twój rozmówca się rozłączył",
        type: "admin",
      });

      // Close the chat session inside the database
      const sessionID = room.sessionID;
      await ChatModel.closeSession(sessionID);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function findFreeRoom(io, socket, rooms, userObject) {
  try {
    // First, validate the user object
    if (userObject.token) {
      userDataSchema.validate(userObject);
    } else {
      anonDataSchema.validate(userObject);
      Object.assign(userObject, { name: "Anonim" });
    }

    // Get the client's IP address and add it to the user object
    const clientIP = getClientIP(socket);
    Object.assign(userObject, { clientIP });

    // Find a room where there is only one user, the room is open,
    // and the criteria for searching match the criteria of the user in the room
    let room = rooms.find((room) => {
      if (room.isRoomOpen && room.users.length === 1) {
        const otherUser = room.users.find((user) => user.id !== socket.id);
        return otherUser && areUsersCompatible(userObject, otherUser);
      }
      return false;
    });

    // If a room does not exist, create a new one
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

      // Create a new chat session in the database
      const sessionObject = {
        firstUserID: room.users[0].userID,
        secondUserID: room.users[1].userID,
        firstUserIP: room.users[0].clientIP,
        secondUserIP: room.users[1].clientIP,
      };

      const sessionID = await ChatModel.createNewSession(sessionObject);
      Object.assign(room, { sessionID });
    }

    // Join the room
    socket.join(room.id);

    const stranger = room.users.find((user) => user.id !== socket.id);

    if (stranger) {
      socket.emit("strangerData", getUserDataObject(stranger));
      // io.to(stranger.id).emit("strangerData", getUserDataObject(userObject));
      socket
        .to(stranger.id)
        .emit("strangerData", getUserDataObject(userObject));
    }

    // Emit an event to all users in the room with the updated user count
    io.to(room.id).emit("roomData", {
      userCount: room.users.length,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}

async function sendMessage(io, socket, rooms, message) {
  try {
    // First, validate the message
    messageSchema.validateSync({ message });

    // Get the client's IP address
    const clientIP = getClientIP(socket);

    const room = findRoomBySocketID(socket, rooms);

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
    await ChatModel.saveMessageToDatabase(sessionObject);

    io.to(room.id).emit("generateMessage", {
      content: message,
      senderID: socket.id,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  leaveRoomBySocketID,
  findFreeRoom,
  sendMessage,
};
