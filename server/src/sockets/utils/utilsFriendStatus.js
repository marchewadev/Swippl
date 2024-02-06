"use strict";

const ChatModel = require("../../models/chatModel");
const { findRoomBySocketID } = require("./helperFunctions");

async function sendFriendRequest(io, socket, rooms) {
  try {
    const room = findRoomBySocketID(socket, rooms);

    if (!room) {
      throw new Error(
        "Nie znaleziono pokoju, do którego można wysłać zaproszenie"
      );
    }

    const user = room.users.find((user) => user.id === socket.id);
    const stranger = room.users.find((user) => user.id !== socket.id);

    // If the user or the stranger does not have a user ID, throw an error
    if (!user.userID || !stranger.userID) {
      throw new Error("Nie udało się wysłać zaproszenia");
    }

    await ChatModel.sendFriendRequest({
      userID: user.userID,
      friendID: stranger.userID,
    });

    socket.emit("generateMessage", {
      content: `Zaproszenie do znajomych zostało wysłane do ${stranger.name}`,
      type: "admin",
    });
    socket.to(room.id).emit("generateMessage", {
      content: `Masz zaproszenie do znajomych od ${user.name}`,
      type: "admin",
    });

    socket.emit("friendStatus", "pending");
    socket.to(room.id).emit("friendRequest", true);
  } catch (err) {
    throw new Error(err.message);
  }
}

async function acceptFriendRequest(io, socket, rooms) {
  try {
    const room = findRoomBySocketID(socket, rooms);

    if (!room) {
      throw new Error(
        "Nie znaleziono pokoju, w którym można zaakceptować zaproszenie"
      );
    }

    const user = room.users.find((user) => user.id === socket.id);
    const stranger = room.users.find((user) => user.id !== socket.id);

    if (!user.userID || !stranger.userID) {
      throw new Error("Nie udało się zaakceptować zaproszenia");
    }

    await ChatModel.acceptFriendRequest({
      userID: user.userID,
      friendID: stranger.userID,
    });

    io.to(room.id).emit("friendStatus", "accepted");
  } catch (err) {
    throw new Error(err.message);
  }
}

async function rejectFriendRequest(io, socket, rooms) {
  // TODO: zaimplementować tę funkcję przy rozłączeniu użytkownika (świadome opuszczenie pokoju lub rozłączenie z serwerem)
  try {
    const room = findRoomBySocketID(socket, rooms);

    if (!room) {
      throw new Error(
        "Nie znaleziono pokoju, w którym można odrzucić zaproszenie"
      );
    }

    const user = room.users.find((user) => user.id === socket.id);
    const stranger = room.users.find((user) => user.id !== socket.id);

    if (!user.userID || !stranger.userID) {
      throw new Error("Nie udało się odrzucić zaproszenia");
    }

    await ChatModel.rejectFriendRequest({
      userID: user.userID,
      friendID: stranger.userID,
    });

    io.to(room.id).emit("friendStatus", "rejected");
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};
