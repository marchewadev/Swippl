const BaseModel = require("./baseModel");
const dayjs = require("dayjs");

class ChatModel extends BaseModel {
  async checkIfUsersAreFriends(sessionID) {
    // Helper function for closeSession. If users are not friends, the session can be set as closed on disconnect.
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
          return true; // Users are friends
        } else {
          return false; // Users are not friends
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
      const result = await this.checkIfUsersAreFriends(sessionID);
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
        "UPDATE friends SET status = $1, updated_at = now() WHERE user_id = $2 AND friend_id = $3 AND status = 'pending'";
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
        "UPDATE friends SET status = $1, updated_at = now() WHERE user_id = $2 AND friend_id = $3";
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

  async removeFriend(sessionObject) {
    try {
      const { userID, friendID, sessionID } = sessionObject;

      const queryFriendsTable =
        "DELETE FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)";
      const valuesFriendsTable = [userID, friendID];

      const querySessionsTable =
        "UPDATE chat_sessions SET end_timestamp = now() WHERE id = $1";
      const valuesSessionsTable = [sessionID];

      await this.pool.query("BEGIN");
      await this.pool.query(queryFriendsTable, valuesFriendsTable);
      await this.pool.query(querySessionsTable, valuesSessionsTable);
      await this.pool.query("COMMIT");
    } catch (err) {
      await this.pool.query("ROLLBACK");
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async getChatHistory(
    firstUserID,
    secondUserID,
    sessionID,
    page = 1,
    limit = 40
  ) {
    // This function returns the chat history between two users who are friends.
    try {
      const offset = (page - 1) * limit;
      const query = `
        SELECT cm.message_content AS content,
          CASE
            WHEN cm.sender_id = $1 THEN 'user'
            ELSE 'stranger'
          END AS type
        FROM chat_sessions cs
        LEFT JOIN chat_messages cm ON cs.id = cm.session_id
        WHERE ((cs.user1_id = $1 AND cs.user2_id = $2) OR (cs.user1_id = $2 AND cs.user2_id = $1))
        AND cs.id = $3
        AND cs.end_timestamp IS NULL
        ORDER BY cm.sent_at DESC
        LIMIT $4 OFFSET $5;
      `;
      const values = [firstUserID, secondUserID, sessionID, limit, offset];
      let { rows: chatHistory } = await this.pool.query(query, values);

      // Reverse the order of messages to display the latest messages at the bottom
      chatHistory = chatHistory.reverse();

      if (chatHistory.length < 1) {
        throw new Error("Nie znaleziono podanego czatu");
      }

      // If the chat history is empty, the first message is null. In this case, we return an empty array.
      if (chatHistory[0].content === null) {
        chatHistory = [];
      }

      const queryForUser2 =
        "SELECT name, city, birthdate, gender, avatar FROM users WHERE id = $1";
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
        avatar: friendRows[0].avatar,
      };

      // Check if there are more messages to load
      const checkMoreMessagesQuery = `
        SELECT 1 FROM chat_messages
        WHERE session_id = $1
        OFFSET $2;
      `;
      const checkMoreMessagesValues = [sessionID, offset + limit];
      const { rows: moreMessagesRows } = await this.pool.query(
        checkMoreMessagesQuery,
        checkMoreMessagesValues
      );
      const hasMoreMessages = moreMessagesRows.length > 0;

      return {
        chatHistory,
        friendObject,
        hasMoreMessages,
      };
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async reportStranger(sessionObject) {
    // This function is responsible for persisting a report to the database. It accomplishes this by creating a new record that includes the session ID, the sender's ID, and the sender's IP address.
    try {
      const { sessionID, senderID, senderIP } = sessionObject;

      const isReportedQuery =
        "SELECT * FROM reported_chats WHERE session_id = $1 AND sender_ip_address = $2";
      const isReportedValues = [sessionID, senderIP];

      const isReportedResult = await this.pool.query(
        isReportedQuery,
        isReportedValues
      );

      if (isReportedResult.rows.length > 0) {
        throw new Error("Rozmowa została już zgłoszona");
      }

      const query =
        "INSERT INTO reported_chats(session_id, sender_id, sender_ip_address) VALUES($1, $2, $3)";
      const values = [sessionID, senderID, senderIP];

      await this.pool.query(query, values);
      return;
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }
}

module.exports = new ChatModel();
