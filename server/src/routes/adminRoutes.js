const express = require("express");
const AdminModel = require("../models/adminModel");
const authAdmin = require("../middleware/authAdmin");

const router = express.Router();

router.post("/create", authAdmin, async (req, res) => {
  try {
    const user = req.body;

    await AdminModel.createAdminByUserId(user, 4);

    res.status(201).send({ message: "Admin created successfully", body: user });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

module.exports = router;
