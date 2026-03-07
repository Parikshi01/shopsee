const express = require("express");
const { registerUser, loginUser, logoutUser, getProfile, makeAdmin } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.get("/profile", protect, getProfile);
router.patch("/promote/:userId", protect, adminOnly, makeAdmin);

module.exports = router;
