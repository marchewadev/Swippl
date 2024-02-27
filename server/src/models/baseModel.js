const yup = require("yup");
const pool = require("../db/dbConfig");

class BaseModel {
  constructor() {
    this.pool = pool;
  }

  handleValidationErrorOrServerIssue(err) {
    if (err instanceof yup.ValidationError) {
      // If the error is an instance of yup.ValidationError, it means that the request body did not pass the validation.
      throw { status: 400, message: err.message };
    } else {
      // If the error is NOT an instance of yup.ValidationError, it means that there was thrown an error in the server or database.
      throw { status: err.status || 500, message: err.message };
    }
  }
}

module.exports = BaseModel;
