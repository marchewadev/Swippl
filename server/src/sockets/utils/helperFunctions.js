function isWithinAgeCriteria(user, criteria) {
  return user.age >= criteria[0] && user.age <= criteria[1];
}

function isWithinGenderCriteria(user, criteria) {
  return criteria === "any" || user.gender === criteria;
}

function areUsersCompatible(user1, user2) {
  return (
    isWithinAgeCriteria(user1, user2.searchCriteria.age) &&
    isWithinAgeCriteria(user2, user1.searchCriteria.age) &&
    isWithinGenderCriteria(user1, user2.searchCriteria.gender) &&
    isWithinGenderCriteria(user2, user1.searchCriteria.gender)
  );
}

function getUserDataObject(user) {
  return {
    name: user.name,
    age: user.age,
    gender: user.gender,
    city: user.city,
    avatar: user.avatar,
  };
}

function findRoomBySocketID(socket, rooms) {
  // Find the room where a user with the given socket ID is present
  const room = rooms.find((room) =>
    room.users.some((user) => user.id === socket.id)
  );
  return room;
}

function getClientIP(socket) {
  let clientIP = socket.handshake.address;
  if (clientIP.includes("::ffff:")) {
    clientIP = clientIP.replace("::ffff:", "");
  }
  return clientIP;
}

module.exports = {
  areUsersCompatible,
  getUserDataObject,
  findRoomBySocketID,
  getClientIP,
};
