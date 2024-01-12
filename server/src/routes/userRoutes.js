const express = require("express");
const UserModel = require("../models/userModel");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = req.body;
    await UserModel.createUser(user);
    res.status(201).send({ message: "User created successfully" });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = req.body;
    await UserModel.loginUser(user);
    res.status(200).send({ message: "User logged in successfully" });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    res.status(200).send({ user: req.user });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

module.exports = router;
