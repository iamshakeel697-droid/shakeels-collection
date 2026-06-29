require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('Admin already exists for this email');
    process.exit(0);
  }

  await Admin.create({
    name: 'Shakeel',
    email,
    password,
    role: 'admin',
  });

  console.log('Admin account created successfully');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
