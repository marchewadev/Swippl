const express = require("express");
const AdminModel = require("../models/adminModel");
const authAdmin = require("../middleware/authAdmin");

const router = express.Router();

router.post("/create", authAdmin, async (req, res) => {
  try {
    const user = req.body;
    const superadminId = req.adminId;

    await AdminModel.createAdminByUserId(user, superadminId);

    res.status(201).send({ message: "Admin utworzony pomyślnie", body: user });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

router.post("/ban", authAdmin, async (req, res) => {
  try {
    const user = req.body;
    const adminId = req.adminId;

    await AdminModel.banUserById(user, adminId);

    res
      .status(201)
      .send({ message: "Zbanowano użytkownika pomyślnie", body: user });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

router.post("/unban", authAdmin, async (req, res) => {
  try {
    const user = req.body;
    const adminId = req.adminId;

    await AdminModel.unbanUserById(user, adminId);

    res
      .status(201)
      .send({ message: "Odbanowano użytkownika pomyślnie", body: user });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

router.delete("/delete", authAdmin, async (req, res) => {
  try {
    const user = req.body;
    const superadminId = req.adminId;

    await AdminModel.deleteAdminById(user, superadminId);

    res.status(201).send({ message: "Admin usunięty pomyślnie", body: user });
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

module.exports = router;
