const BaseModel = require("./baseModel");
const dayjs = require("dayjs");

class ChatModel extends BaseModel {
  async checkIfUsersAreFriends(sessionID) {
    // Helper function for closeSession. If users are not friends, the session can be closed on disconnect.
    try {
      const sessionQuery =
        "SELECT user1_id, user2_id FROM chat_sessions WHERE id = $1";
      const sessionValues = [sessionID];

      const sessionResult = await this.pool.query(sessionQuery, sessionValues);

      if (sessionResult.rows.length > 0) {
        const { user1_id, user2_id } = sessionResult.rows[0];

        const friendsQuery = `
          SELECT * FROM friends 
          WHERE ((user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)) 
          AND status = 'accepted'
        `;
        const friendsValues = [user1_id, user2_id];

        const friendsResult = await this.pool.query(
          friendsQuery,
          friendsValues
        );

        if (friendsResult.rows.length > 0) {
          return true; // Użytkownicy są znajomymi
        } else {
          return false; // Użytkownicy nie są znajomymi
        }
      } else {
        throw new Error("Nie znaleziono sesji o podanym ID");
      }
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async createNewSession(sessionObject) {
    try {
      const { firstUserID, secondUserID, firstUserIP, secondUserIP } =
        sessionObject;

      const query =
        "INSERT INTO chat_sessions(user1_id, user2_id, user1_ip_address, user2_ip_address) VALUES($1, $2, $3, $4) RETURNING id";
      const values = [
        typeof firstUserID === "undefined" ? null : firstUserID,
        typeof secondUserID === "undefined" ? null : secondUserID,
        firstUserIP,
        secondUserIP,
      ];

      const result = await this.pool.query(query, values);
      const sessionID = result.rows[0].id;

      return sessionID;
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async closeSession(sessionID) {
    try {
      const result = this.checkIfUsersAreFriends(sessionID);
      if (result) return;

      const query =
        "UPDATE chat_sessions SET end_timestamp = now() WHERE id = $1";
      const values = [sessionID];

      await this.pool.query(query, values);
      return;
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async saveMessageToDatabase(sessionObject) {
    try {
      const { sessionID, senderID, senderIP, message } = sessionObject;

      const query =
        "INSERT INTO chat_messages(session_id, sender_id, sender_ip_address, message_content) VALUES($1, $2, $3, $4)";
      const values = [sessionID, senderID, senderIP, message];

      await this.pool.query(query, values);
      return;
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async sendFriendRequest(sessionObject) {
    try {
      const { userID, friendID } = sessionObject;

      // TODO: sprawdzić czy użytkownicy nie są już znajomymi, czy nie ma już wysłanego zaproszenia, czy nie mają tego samego id itp.

      const result = await this.pool.query(
        "SELECT status FROM friends WHERE user_id = $1 AND friend_id = $2",
        [userID, friendID]
      );

      if (result.rows.length > 0 && result.rows[0].status !== "rejected") {
        if (result.rows[0].status === "pending") {
          throw new Error("Zaproszenie zostało już wysłane");
        } else {
          throw new Error("Jesteście już znajomymi");
        }
      }

      const query =
        "INSERT INTO friends(user_id, friend_id, status) VALUES($1, $2, $3)";
      const userValues = [userID, friendID, "pending"];
      const friendValues = [friendID, userID, "pending"];

      await this.pool.query("BEGIN");
      await this.pool.query(query, userValues);
      await this.pool.query(query, friendValues);
      await this.pool.query("COMMIT");
      return;
    } catch (err) {
      await this.pool.query("ROLLBACK");
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async acceptFriendRequest(sessionObject) {
    try {
      const { userID, friendID } = sessionObject;

      const query =
        "UPDATE friends SET status = $1, updated_at = now() WHERE user_id = $2 AND friend_id = $3";
      const userValues = ["accepted", userID, friendID];
      const friendValues = ["accepted", friendID, userID];

      await this.pool.query("BEGIN");
      await this.pool.query(query, userValues);
      await this.pool.query(query, friendValues);
      await this.pool.query("COMMIT");
    } catch (err) {
      await this.pool.query("ROLLBACK");
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async rejectFriendRequest(sessionObject) {
    try {
      const { userID, friendID } = sessionObject;

      const query =
        "UPDATE friends SET status = $1 AND updated_at = now() WHERE user_id = $2 AND friend_id = $3";
      const userValues = ["rejected", userID, friendID];
      const friendValues = ["rejected", friendID, userID];

      await this.pool.query("BEGIN");
      await this.pool.query(query, userValues);
      await this.pool.query(query, friendValues);
      await this.pool.query("COMMIT");
    } catch (err) {
      await this.pool.query("ROLLBACK");
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async getChatHistory(firstUserID, secondUserID) {
    try {
      const query = `
        SELECT cm.message_content AS content,
          CASE
            WHEN cm.sender_id = $1 THEN 'user'
            ELSE 'stranger'
          END AS type
        FROM chat_sessions cs
        JOIN chat_messages cm ON cs.id = cm.session_id
        WHERE (cs.user1_id = $1 AND cs.user2_id = $2) OR (cs.user1_id = $2 AND cs.user2_id = $1);
      `;
      const values = [firstUserID, secondUserID];
      const { rows: chatHistory } = await this.pool.query(query, values);

      if (chatHistory.length < 1) {
        throw new Error("Nie znaleziono podanego czatu");
      }

      const queryForUser2 =
        "SELECT name, city, birthdate, gender FROM users WHERE id = $1";
      const valuesForUser2 = [secondUserID];
      const { rows: friendRows } = await this.pool.query(
        queryForUser2,
        valuesForUser2
      );

      const friendObject = {
        name: friendRows[0].name,
        city: friendRows[0].city,
        age: dayjs().diff(friendRows[0].birthdate, "year"),
        gender: friendRows[0].gender,
      };

      return {
        chatHistory,
        friendObject,
      };
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }
}

module.exports = new ChatModel();
