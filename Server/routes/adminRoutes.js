const express = require("express");
const { listAdmins, getAdminDashboard } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getAdminDashboard);
router.get("/admins", protect, adminOnly, listAdmins);

module.exports = router;
