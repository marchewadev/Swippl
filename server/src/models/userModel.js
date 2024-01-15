const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const BaseModel = require("./baseModel");
const {
  createUserSchema,
  loginUserSchema,
  deleteUserSchema,
  updateUserProfileSchema,
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
        message:
          "Użytkownik jest zbanowany i nie może edytować swojego profilu",
      };
    }
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async createUser(userJSON) {
    try {
      await createUserSchema.validate(userJSON);

      const { email, password, name, gender, birthdate } = userJSON;

      // Check if user with given email address already exists.
      const userExists = await this.pool.query(
        "SELECT 1 FROM users WHERE email = $1",
        [email]
      );
      if (userExists.rows.length > 0) {
        throw {
          status: 409,
          message: "Użytkownik o podanym adresie e-mail już istnieje!",
        };
      }

      const hashedPassword = await this.hashPassword(password);

      const queryText = `INSERT INTO users(
      email,
      password,
      name,
      gender,
      birthdate
      ) VALUES($1, $2, $3, $4, $5) RETURNING *`;
      // TODO: w returning może dodać samo id?
      const values = [email, hashedPassword, name, gender, birthdate];

      // Create a new user and return the result to generate a JWT token with the user's data such as id.
      const result = await this.pool.query(queryText, values);
      const user = result.rows[0];
      const token = this.#generateAuthToken(user.id);

      return token;
    } catch (err) {
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async loginUser(userJSON) {
    try {
      await loginUserSchema.validate(userJSON);

      const { email: clientEmail, password: clientPassword } = userJSON;

      // TODO: po zalogowaniu użytkownika niech zwraca informację jeżeli jest zbanowany

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

  async getUserById(userId) {
    try {
      const user = await this.pool.query("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);

      if (user.rows.length === 0) {
        throw { status: 404, message: "Nie znaleziono użytkownika" };
      }

      return user.rows[0];
    } catch (err) {
      // TODO: Może poprawić to w przyszłości? Chodzi mi o to, że ta funkcja głównie służy do obsługi błędu podczas walidacji schematu Yup i serwera jednocześnie. Może warto byłoby to rozdzielić?
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async updateUserProfileById(userJSON, userId) {
    try {
      await this.#checkIfUserIsBanned(userId);

      await updateUserProfileSchema.validate(userJSON);

      let query = "UPDATE users SET ";
      let params = [];

      const clauses = Object.entries(userJSON).map(([key, value], i, arr) => {
        params.push(value);
        return `${key} = $${params.length}${i === arr.length - 1 ? "" : ", "}`;
      });

      query += clauses.join("");
      query += ` WHERE id = $${params.length + 1}`;
      params.push(userId);

      const result = await this.pool.query(query, params);

      if (result.rowCount === 0) {
        throw { status: 404, message: "Nie znaleziono użytkownika" };
      }

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
