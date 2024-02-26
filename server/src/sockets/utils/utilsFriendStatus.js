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

    room.isFriendRequestPending = true;

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

    room.isFriendRequestPending = false;

    io.to(room.id).emit("friendStatus", "accepted");
  } catch (err) {
    throw new Error(err.message);
  }
}

async function rejectFriendRequest(socket, room) {
  try {
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

    room.isFriendRequestPending = false;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function removeFriend(
  socket,
  privateRooms,
  { userID, userName, friendID, sessionID }
) {
  try {
    // TODO: delete room from privateRooms
    const room = privateRooms.find((room) => room.sessionID === sessionID);

    if (!room) {
      throw new Error("Nie udało się usunąć znajomego");
    }

    // Make sure that the user and the friend are in the same room
    const userInRoom = room.users.some((user) => user.id === userID);
    const friendInRoom = room.users.some((user) => user.id === friendID);

    if (!userInRoom || !friendInRoom) {
      throw new Error("Nie udało się usunąć znajomego");
    }

    // Remove the friend
    await ChatModel.removeFriend({ userID, friendID, sessionID });

    socket
      .to(room.sessionID)
      .emit("friendRemoved", { sessionID, userName }, () => {
        // Remove the room from the privateRooms array
        const roomIndex = privateRooms.findIndex(
          (room) => room.sessionID === sessionID
        );
        privateRooms.splice(roomIndex, 1);
      });
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
};
