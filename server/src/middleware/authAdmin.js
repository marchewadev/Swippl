const jwt = require("jsonwebtoken");
const AdminModel = require("../models/adminModel");

const authAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = AdminModel.checkIfUserIsAdmin(decoded.userId);

    if (!admin) {
      throw new Error();
    }

    next();
  } catch (err) {
    res.status(401).send({ message: "Invalid authentication." });
  }
};

module.exports = authAdmin;
