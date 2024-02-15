"use strict";

const ChatModel = require("../../models/chatModel");
const { getClientIP } = require("./helperFunctions");
const { messageSchema } = require("../schemas/messageSchema");

async function createUserSession(io, socket, privateRooms, sessionObject) {
  try {
    sessionObject.friends.forEach((friend) => {
      // Check if the private room already exists
      let privateRoom = privateRooms.find(
        (room) => room.sessionID === friend.sessionID
      );

      // If the private room doesn't exist, create it by using the sessionID
      if (!privateRoom) {
        privateRoom = {
          sessionID: friend.sessionID,
          users: [
            {
              id: sessionObject.userID,
              online: true,
            },
            {
              id: friend.id,
              online: false,
            },
          ],
        };
        privateRooms.push(privateRoom);
      } else {
        // If the private room exists, update the user's online status
        const user = privateRoom.users.find(
          (user) => user.id === sessionObject.userID
        );

        if (user) {
          user.online = true;
        }
      }

      socket.join(privateRoom.sessionID);
    });
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getChatHistory({ userID, friendID, sessionID }) {
  try {
    const chatHistory = await ChatModel.getChatHistory(
      userID,
      friendID,
      sessionID
    );
    Object.assign(chatHistory, { friendStatus: "accepted" });

    return chatHistory;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function sendPrivateMessage(
  io,
  socket,
  privateRooms,
  { message, userID, sessionID }
) {
  try {
    // First, validate the message
    messageSchema.validate({ message });
    // Get the client's IP address
    const clientIP = getClientIP(socket);
    // Get the room by searching for the sessionID
    const room = privateRooms.find((room) => room.sessionID === sessionID);

    const sessionObject = {
      sessionID,
      senderID: userID,
      senderIP: clientIP,
      message,
    };
    await ChatModel.saveMessageToDatabase(sessionObject);

    io.to(room.sessionID).emit("generatePrivateMessage", {
      content: message,
      senderID: userID,
      sessionID,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}

async function toggleOnlineStatus(privateRooms, userID) {
  try {
    const roomsToRemove = [];

    privateRooms.forEach((room, index) => {
      const user = room.users.find((user) => user.id === userID);
      if (user) {
        user.online = !user.online;
      }

      if (room.users.every((user) => !user.online)) {
        roomsToRemove.push(index);
      }
    });

    for (let i = roomsToRemove.length - 1; i >= 0; i--) {
      privateRooms.splice(roomsToRemove[i], 1);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getChatHistory,
  sendPrivateMessage,
  createUserSession,
  toggleOnlineStatus,
};
