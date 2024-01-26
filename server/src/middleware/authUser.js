const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (err) {
    res.status(401).send({ message: "Invalid authentication." });
  }
};

module.exports = authUser;
