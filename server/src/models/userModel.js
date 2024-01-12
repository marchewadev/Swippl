const bcrypt = require("bcrypt");
const yup = require("yup");
const jwt = require("jsonwebtoken");

const pool = require("../db/dbConfig");
const { createUserSchema, loginUserSchema } = require("./userSchema");

class UserModel {
  constructor(pool) {
    this.pool = pool;
  }

  #generateAuthToken(userId) {
    const payload = { userId };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: "24h" };
    return jwt.sign(payload, secret, options);
  }

  #handleValidationErrorOrServerIssue(err) {
    if (err instanceof yup.ValidationError) {
      throw { status: 400, message: err.message };
    } else {
      throw { status: err.status || 500, message: err.message };
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
      const values = [email, hashedPassword, name, gender, birthdate];

      // Create a new user and return the result to generate a JWT token with the user's data.
      const result = await this.pool.query(queryText, values);
      const user = result.rows[0];
      const token = this.#generateAuthToken(user.id);
      console.log(token);
      return token;
    } catch (err) {
      this.#handleValidationErrorOrServerIssue(err);
    }
  }

  async loginUser(userJSON) {
    try {
      await loginUserSchema.validate(userJSON);

      const { email, password } = userJSON;

      const user = await this.pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (
        user.rows.length === 0 ||
        !(await bcrypt.compare(password, user.rows[0].password))
      ) {
        throw { status: 401, message: "Nieprawidłowe dane logowania" };
      }

      return user.rows[0];
    } catch (err) {
      this.#handleValidationErrorOrServerIssue(err);
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
      this.#handleValidationErrorOrServerIssue(err);
    }
  }
}

module.exports = new UserModel(pool);
