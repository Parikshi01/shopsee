require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Admin = require("../models/Admin");

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/makeAdmin.js <user-email>");
  process.exit(1);
}

const run = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shopshee";
  await mongoose.connect(mongoUri);

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error(`User not found for email: ${email}`);
  }

  user.role = "admin";
  await user.save();

  const existing = await Admin.findOne({ user: user._id });
  if (!existing) {
    await Admin.create({ user: user._id });
  }

  console.log(`Success: ${user.email} is now an admin.`);
};

run()
  .catch((error) => {
    console.error(`make-admin failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
