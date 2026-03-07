const Admin = require("../models/Admin");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const listAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find().populate("user", "name email role");
  res.json(admins);
});

const getAdminDashboard = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalAdmins = await Admin.countDocuments();

  res.json({
    message: "Admin dashboard data",
    totals: {
      users: totalUsers,
      admins: totalAdmins,
    },
  });
});

module.exports = {
  listAdmins,
  getAdminDashboard,
};
