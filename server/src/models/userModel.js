const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");

const BaseModel = require("./baseModel");
const {
  createUserSchema,
  loginUserSchema,
  deleteUserSchema,
  updateUserProfileSchema,
  updateUserEmailSchema,
  updateUserPasswordSchema,
} = require("./userSchema");

class UserModel extends BaseModel {
  #generateAuthToken(userId) {
    const payload = { userId };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: "24h" };
    return jwt.sign(payload, secret, options);
  }

  async #checkIfUserIsBanned(userId) {
    const bannedUser = await this.pool.query(
      "SELECT * FROM banned_users WHERE user_id = $1",
      [userId]
    );

    if (bannedUser.rows.length > 0) {
      throw {
        status: 403,
        message: `Twoje konto zostało zablokowane do ${bannedUser.rows[0].ban_until}`,
      };
    }
  }

  async #hashPassword(password) {
    return await bcrypt.hash(password, 10);
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

      return token;
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
        "SELECT id, password FROM users WHERE email = $1",
        [clientEmail]
      );

      if (
        user.rows.length === 0 ||
        !(await bcrypt.compare(clientPassword, user.rows[0].password))
      ) {
        throw { status: 401, message: "Nieprawidłowe dane logowania" };
      }

      const token = this.#generateAuthToken(user.rows[0].id);

      return token;
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  // async getUserById(userId) {
  //   try {
  //     const user = await this.pool.query("SELECT * FROM users WHERE id = $1", [
  //       userId,
  //     ]);

  //     if (user.rows.length === 0) {
  //       throw { status: 404, message: "Nie znaleziono użytkownika" };
  //     }

  //     return user.rows[0];
  //   } catch (err) {
  //     this.handleValidationErrorOrServerIssue(err);
  //   }
  // }

  async updateUserProfileById(userJSON, userId) {
    try {
      await this.#checkIfUserIsBanned(userId);

      await updateUserProfileSchema.validate(userJSON);

      const user = await this.pool.query(
        "SELECT name, city, birthdate FROM users WHERE id = $1",
        [userId]
      );

      const {
        name: databaseName,
        city: databaseCity,
        birthdate: databaseBirthdate,
      } = user.rows[0];
      const {
        name: clientName,
        city: clientCity,
        birthdate: clientBirthdate,
      } = userJSON;

      if (clientName !== undefined) {
        if (databaseName === clientName) {
          throw { status: 409, message: "Podane imię jest takie samo" };
        }
      }
      if (clientCity !== undefined) {
        if (databaseCity === clientCity) {
          throw { status: 409, message: "Podana miejscowość jest taka sama" };
        }
      }
      if (clientBirthdate !== undefined) {
        const dbDate = dayjs(databaseBirthdate);
        const clientDate = dayjs(clientBirthdate);

        if (dbDate.isSame(clientDate, "day")) {
          throw {
            status: 409,
            message: "Podana data urodzenia jest taka sama",
          };
        }
      }

      let query = "UPDATE users SET ";
      let values = [];

      const clauses = Object.entries(userJSON).map(([key, value], i, arr) => {
        values.push(value);
        return `${key} = $${values.length}${i === arr.length - 1 ? "" : ", "}`;
      });
      query += clauses.join("");
      query += ` WHERE id = $${values.length + 1}`;
      values.push(userId);

      return;
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async updateUserEmailById(userJSON, userId) {
    try {
      await this.#checkIfUserIsBanned(userId);

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
      await this.#checkIfUserIsBanned(userId);

      await updateUserPasswordSchema.validate(userJSON);

      const user = await this.pool.query(
        "SELECT password FROM users WHERE id = $1",
        [userId]
      );

      const { password: databasePassword } = user.rows[0];
      const { password: clientPassword } = userJSON;

      if (await bcrypt.compare(clientPassword, databasePassword)) {
        throw { status: 409, message: "Podane hasło jest takie samo" };
      }

      const hashedPassword = await this.#hashPassword(clientPassword);

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
}

module.exports = new UserModel();
