const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const BaseModel = require("./baseModel");
const generateRandomPassword = require("../utils/generateRandomPassword");
const sendMail = require("../services/sendgridEmailService");
const {
  createUserSchema,
  loginUserSchema,
  deleteUserSchema,
  updateUserProfileSchema,
  updateUserEmailSchema,
  updateUserPasswordSchema,
} = require("./userSchema");
const {
  uploadToAzureBlobStorage,
  deleteFromAzureBlobStorage,
} = require("../services/azureStorageService");

class UserModel extends BaseModel {
  #generateAuthToken(userId) {
    const payload = { userId };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: "24h" };
    return jwt.sign(payload, secret, options);
  }

  async #hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async checkIfUserIsBanned(userId) {
    const bannedUser = await this.pool.query(
      "SELECT * FROM banned_users WHERE user_id = $1",
      [userId]
    );

    if (bannedUser.rows.length > 0) {
      const date = dayjs.utc(bannedUser.rows[0].ban_until);
      const localDate = date.local().format("DD.MM.YYYY");

      throw {
        status: 403,
        message: `Twoje konto zostało zablokowane do ${localDate} z powodu: ${bannedUser.rows[0].reason}`,
      };
    }
  }

  async createUser(userJSON) {
    try {
      await createUserSchema.validate(userJSON);

      const { email, password, name, gender, birthdate } = userJSON;

      const hashedPassword = await this.#hashPassword(password);

      const query = `INSERT INTO users(
      email,
      password,
      name,
      gender,
      birthdate
      ) VALUES($1, $2, $3, $4, $5) RETURNING id`;
      const values = [email, hashedPassword, name, gender, birthdate];

      // Create a new user and return the result to generate a JWT token using the user's id.
      const result = await this.pool.query(query, values);
      const user = result.rows[0];
      const token = this.#generateAuthToken(user.id);

      return { token };
    } catch (err) {
      if (err.code === "23505") {
        throw {
          status: 409,
          message: "Użytkownik o podanym adresie e-mail już istnieje!",
        };
      } else {
        this.handleValidationErrorOrServerIssue(err);
      }
    }
  }

  async loginUser(userJSON) {
    try {
      await loginUserSchema.validate(userJSON);

      const { email: clientEmail, password: clientPassword } = userJSON;

      const user = await this.pool.query(
        "SELECT id, name, city, birthdate, password FROM users WHERE email = $1",
        [clientEmail]
      );

      if (
        user.rows.length === 0 ||
        !(await bcrypt.compare(clientPassword, user.rows[0].password))
      ) {
        throw { status: 401, message: "Nieprawidłowe dane logowania" };
      }

      const token = this.#generateAuthToken(user.rows[0].id);

      return { token };
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async getUserById(userId) {
    try {
      const user = await this.pool.query(
        "SELECT id, name, birthdate, city, gender, avatar FROM users WHERE id = $1",
        [userId]
      );

      const userData = user.rows[0];
      userData.birthdate = dayjs(userData.birthdate).format("YYYY-MM-DD");

      return userData;
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async updateUserProfileById(userJSON, userId) {
    try {
      await this.checkIfUserIsBanned(userId);

      await updateUserProfileSchema.validate(userJSON);

      const user = await this.pool.query(
        "SELECT name, city, birthdate, avatar FROM users WHERE id = $1",
        [userId]
      );

      // If the user doesn't provide a value for a city field, set it to null due to the database schema.
      if (userJSON.city === "") {
        userJSON.city = null;
      }

      const {
        name: databaseName,
        city: databaseCity,
        birthdate: databaseBirthdate,
        avatar: databaseAvatar,
      } = user.rows[0];
      const {
        name: clientName,
        city: clientCity,
        birthdate: clientBirthdate,
        avatar: clientAvatar,
        avatarToDelete: clientAvatarToDelete,
      } = userJSON;

      // Convert the date strings to dayjs objects to compare them.
      const dbDate = dayjs(databaseBirthdate);
      const clientDate = dayjs(clientBirthdate);

      if (clientName === databaseName) {
        delete userJSON.name;
      }

      if (clientCity === databaseCity) {
        delete userJSON.city;
      }

      if (dbDate.isSame(clientDate, "day")) {
        delete userJSON.birthdate;
      }

      let avatarURL;
      if (!clientAvatar) {
        delete userJSON.avatar;
      } else {
        avatarURL = await uploadToAzureBlobStorage(clientAvatar);
        Object.assign(userJSON, { avatar: avatarURL });
      }

      // If user already has an avatar, delete the old one from the Azure Blob Storage.
      if (clientAvatar && databaseAvatar) {
        await deleteFromAzureBlobStorage(databaseAvatar);
      }

      // If the user wants to delete the avatar, delete it from the Azure Blob Storage and remove the avatar field from the userJSON object.
      if (clientAvatarToDelete && databaseAvatar) {
        await deleteFromAzureBlobStorage(databaseAvatar);

        delete userJSON.avatarToDelete;
        userJSON.avatar = null;
      } else {
        delete userJSON.avatarToDelete;
      }

      if (Object.keys(userJSON).length === 0) {
        throw {
          status: 409,
          message: "Twoje dane są aktualne. Brak konieczności aktualizacji",
        };
      }

      let query = "UPDATE users SET ";
      let values = [];

      Object.entries(userJSON).forEach(([key, value]) => {
        values.push(value);
        query += `${key} = $${values.length}, `;
      });

      query += `updated_at = now() WHERE id = $${values.length + 1}`;
      values.push(userId);

      await this.pool.query(query, values);

      return { avatarURL };
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async updateUserEmailById(userJSON, userId) {
    try {
      await this.checkIfUserIsBanned(userId);

      await updateUserEmailSchema.validate(userJSON);

      const user = await this.pool.query(
        "SELECT email, password FROM users WHERE id = $1",
        [userId]
      );

      const { email: databaseEmail, password: databasePassword } = user.rows[0];
      const { email: clientEmail, password: clientPassword } = userJSON;

      if (databaseEmail === clientEmail) {
        throw { status: 409, message: "Podany adres e-mail jest taki sam" };
      }

      if (!(await bcrypt.compare(clientPassword, databasePassword))) {
        throw { status: 401, message: "Nieprawidłowe dane logowania" };
      }

      const query =
        "UPDATE users SET email = $1, updated_at = now() WHERE id = $2";
      const values = [clientEmail, userId];

      await this.pool.query(query, values);

      return;
    } catch (err) {
      if (err.code === "23505") {
        throw {
          status: 409,
          message: "Użytkownik o podanym adresie e-mail już istnieje!",
        };
      } else {
        this.handleValidationErrorOrServerIssue(err);
      }
    }
  }

  async updateUserPasswordById(userJSON, userId) {
    try {
      await this.checkIfUserIsBanned(userId);

      await updateUserPasswordSchema.validate(userJSON);

      const user = await this.pool.query(
        "SELECT password FROM users WHERE id = $1",
        [userId]
      );

      const { password: databasePassword } = user.rows[0];
      const { oldPassword: clientOldPassword, newPassword: clientNewPassword } =
        userJSON;

      if (!(await bcrypt.compare(clientOldPassword, databasePassword))) {
        throw { status: 401, message: "Nieprawidłowe dane logowania" };
      }

      if (await bcrypt.compare(clientNewPassword, databasePassword)) {
        throw { status: 409, message: "Podane hasło jest takie samo" };
      }

      const hashedPassword = await this.#hashPassword(clientNewPassword);

      const query =
        "UPDATE users SET password = $1, updated_at = now() WHERE id = $2";
      const values = [hashedPassword, userId];

      await this.pool.query(query, values);
      return;
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async deleteUser(userJSON, userId) {
    // This function utilizes both JWT and user data provided in the form. The data is first validated using the Yup package and then compared to the information retrieved from the database using the user ID contained in the JWT. If everything matches, the user is removed from the database.

    try {
      await deleteUserSchema.validate(userJSON);
      const user = await this.pool.query(
        "SELECT email, password FROM users WHERE id = $1",
        [userId]
      );

      const { email: databaseEmail, password: databasePassword } = user.rows[0];
      const { email: clientEmail, password: clientPassword } = userJSON;

      if (
        clientEmail !== databaseEmail ||
        !(await bcrypt.compare(clientPassword, databasePassword))
      ) {
        throw { status: 401, message: "Nieprawidłowe dane logowania" };
      }

      const result = await this.pool.query("DELETE FROM users WHERE id = $1", [
        userId,
      ]);

      if (result.rowCount === 0) {
        throw { status: 404, message: "Nie znaleziono użytkownika" };
      }

      return;
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async getFriendsList(userId) {
    try {
      const query =
        "SELECT friend_id FROM friends WHERE user_id = $1 AND STATUS = $2";
      const values = [userId, "accepted"];

      const result = await this.pool.query(query, values);

      let friends = [];
      for (let friend of result.rows) {
        const query = "SELECT name, avatar FROM users WHERE id = $1";
        const values = [friend.friend_id];

        const result = await this.pool.query(query, values);
        const friendName = result.rows[0].name;
        const friendAvatar = result.rows[0].avatar || "";

        const sessionIDQuery = `
          SELECT id FROM chat_sessions 
          WHERE ((user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)) 
          AND end_timestamp IS NULL
        `;
        const sessionIDValues = [userId, friend.friend_id];
        const sessionIDResult = await this.pool.query(
          sessionIDQuery,
          sessionIDValues
        );
        const sessionID = sessionIDResult.rows[0]
          ? sessionIDResult.rows[0].id
          : null;

        const latestMessageQuery =
          "SELECT message_content FROM chat_messages WHERE session_id = $1 ORDER BY sent_at DESC LIMIT 1";
        const latestMessageValues = [sessionID];
        const latestMessageResult = await this.pool.query(
          latestMessageQuery,
          latestMessageValues
        );

        const latestMessage = latestMessageResult.rows[0] || {
          message_content: "",
        };

        friends.push({
          name: friendName,
          avatar: friendAvatar,
          id: friend.friend_id,
          sessionID: sessionID,
          latestMessage,
        });
      }

      return friends;
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async resetUserPassword({ email }) {
    try {
      const searchForUserQuery =
        "SELECT id, name, last_password_reset FROM users WHERE email = $1";
      const searchForUserValues = [email];

      const user = await this.pool.query(
        searchForUserQuery,
        searchForUserValues
      );

      if (user.rows.length < 1) {
        throw {
          status: 404,
          message: "Nie znaleziono użytkownika o takim adresie e-mail",
        };
      }

      if (user.rows[0].last_password_reset) {
        const lastReset = dayjs.utc(user.rows[0].last_password_reset);
        const now = dayjs.utc();
        const diffInMinutes = now.diff(lastReset, "minute");

        if (diffInMinutes < 10) {
          throw {
            status: 429,
            message: "Hasło zostało już zresetowane w ciągu ostatnich 10 minut",
          };
        }
      }

      const password = generateRandomPassword(40);
      const hashedPassword = await this.#hashPassword(password);

      const updatePasswordQuery =
        "UPDATE users SET password = $1, updated_at = now(), last_password_reset = now() WHERE id = $2";
      const updatePasswordValues = [hashedPassword, user.rows[0].id];

      await this.pool.query(updatePasswordQuery, updatePasswordValues);
      await sendMail(email, user.rows[0].name, password);

      return;
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }
}

module.exports = new UserModel();
