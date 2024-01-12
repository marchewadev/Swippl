const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.getUserById(decoded.userId);
    if (!user) {
      throw new Error("Invalid authentication.");
    }

    req.token = token;
    req.user = user;

    next();
  } catch (err) {
    res.status(401).send({ message: "Invalid authentication." });
  }
};

module.exports = auth;
