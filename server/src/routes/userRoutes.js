const express = require("express");
const UserModel = require("../models/userModel");
const authUser = require("../middleware/authUser");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = req.body;
    const token = await UserModel.createUser(user);
    res.status(201).send({ message: "User created successfully", token });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = req.body;
    const token = await UserModel.loginUser(user);
    res.status(200).send({ message: "User logged in successfully", token });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

router.delete("/delete", authUser, async (req, res) => {
  try {
    await UserModel.deleteUser(req.body, req.userId);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

router.patch("/update/profile", authUser, async (req, res) => {
  try {
    await UserModel.updateUserProfileById(req.body, req.userId);
    res.status(200).send({ message: "User updated successfully" });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

module.exports = router;
