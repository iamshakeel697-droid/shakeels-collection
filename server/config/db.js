const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    autoIndex: true,
  });
  console.log('MongoDB connected');
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });
};

module.exports = connectDB;
