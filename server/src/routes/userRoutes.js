const express = require("express");
const multer = require("multer");

const UserModel = require("../models/userModel");
const authUser = require("../middleware/authUser");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/verify", authUser, async (req, res) => {
  try {
    const userObject = await UserModel.getUserById(req.userId);
    const friendsObject = await UserModel.getFriendsList(req.userId);
    res.status(200).send({
      message: "Użytkownik pomyślnie zweryfikowany",
      userObject,
      friendsObject,
    });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const userObject = await UserModel.createUser(req.body);
    res
      .status(201)
      .send({ message: "Twoje konto zostało utworzone", userObject });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const userObject = await UserModel.loginUser(req.body);
    res.status(200).send({ message: "Zalogowano pomyślnie", userObject });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

router.patch(
  "/update/profile",
  authUser,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const userObject = {
        name: req.body.name,
        city: req.body.city,
        birthdate: req.body.birthdate,
        avatar: req.file,
      };

      await UserModel.updateUserProfileById(userObject, req.userId);
      res.status(200).send({ message: "Twoje konto zostało zaktualizowane" });
    } catch (err) {
      res.status(err.status).send({ message: err.message });
    }
  }
);

router.patch("/update/email", authUser, async (req, res) => {
  try {
    await UserModel.updateUserEmailById(req.body, req.userId);
    res.status(200).send({
      message:
        "Twoje konto zostało zaktualizowane. Możesz się zalogować ponownie",
    });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

router.patch("/update/password", authUser, async (req, res) => {
  try {
    await UserModel.updateUserPasswordById(req.body, req.userId);
    res.status(200).send({
      message:
        "Twoje konto zostało zaktualizowane. Możesz się zalogować ponownie",
    });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

router.delete("/delete", authUser, async (req, res) => {
  try {
    await UserModel.deleteUser(req.body, req.userId);
    res.status(200).send({ message: "Twoje konto zostało usunięte" });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

module.exports = router;
