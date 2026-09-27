/**
 * Dummy-data seed script.
 * Run with: npm run seed
 *
 * Creates a few practice users and meetings so you can log in immediately
 * and see the Dashboard / Recent Meetings populated without registering
 * by hand every time you reset your database.
 *
 * All dummy users share the same password: Password123
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Meeting = require("../models/Meeting");

const dummyUsers = [
  { name: "Ava Torres", username: "ava", email: "ava@example.com" },
  { name: "Liam Chen", username: "liam", email: "liam@example.com" },
  { name: "Maya Singh", username: "maya", email: "maya@example.com" },
];

const run = async () => {
  await connectDB();

  await User.deleteMany({});
  await Meeting.deleteMany({});

  const hashedPassword = await bcrypt.hash("Password123", 10);

  const createdUsers = await User.insertMany(
    dummyUsers.map((u) => ({ ...u, password: hashedPassword }))
  );

  console.log("Seeded users:");
  createdUsers.forEach((u) => console.log(`  ${u.email} / Password123`));

  const [ava, liam, maya] = createdUsers;

  await Meeting.insertMany([
    {
      roomId: "demo01",
      title: "Weekly Standup",
      host: ava._id,
      participants: [ava._id, liam._id],
    },
    {
      roomId: "demo02",
      title: "Design Review",
      host: liam._id,
      participants: [liam._id, maya._id, ava._id],
    },
    {
      roomId: "demo03",
      title: "1:1 Catch-up",
      host: maya._id,
      participants: [maya._id, ava._id],
      endedAt: new Date(),
    },
  ]);

  console.log("Seeded meetings: demo01, demo02, demo03");
  console.log("Done. You can now log in with any dummy user above.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
