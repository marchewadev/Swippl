const BaseModel = require("./baseModel");

class ChatModel extends BaseModel {
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
}

module.exports = new ChatModel();
