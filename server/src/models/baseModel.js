const yup = require("yup");
const pool = require("../db/dbConfig");

class BaseModel {
  constructor() {
    this.pool = pool;
  }

  handleValidationErrorOrServerIssue(err) {
    if (err instanceof yup.ValidationError) {
      throw { status: 400, message: err.message };
    } else {
      throw { status: err.status || 500, message: err.message };
    }
  }
}

module.exports = BaseModel;
