// config/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/construction_db';
const client = new MongoClient(MONGODB_URI);

let dbConnection;

const connectDB = async () => {
  try {
    if (!dbConnection) {
      await client.connect();
      dbConnection = client.db();
      console.log('MongoDB connected');
    }
    return dbConnection;
  } catch (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
};

const getDB = () => dbConnection;

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = { connectDB, getDB, closeDB };