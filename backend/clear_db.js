require('dotenv').config();
const mongoose = require('mongoose');

async function clearDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // Keep the admin user, delete others
    const User = require('./src/models/User.model');
    await User.deleteMany({ role: { $ne: 'admin' } });
    console.log('Cleared mock users');

    const Charity = require('./src/models/Charity.model');
    await Charity.deleteMany({});
    console.log('Cleared mock charities');

    const Winner = require('./src/models/Winner.model');
    await Winner.deleteMany({});
    console.log('Cleared mock winners');

    const Score = require('./src/models/Score.model');
    await Score.deleteMany({});
    console.log('Cleared mock scores');

    const Draw = require('./src/models/Draw.model');
    await Draw.deleteMany({});
    console.log('Cleared mock draws');

    const Subscription = require('./src/models/Subscription.model');
    await Subscription.deleteMany({});
    console.log('Cleared mock subscriptions');

    console.log('Database cleared of mock data successfully!');
  } catch (error) {
    console.error('Error clearing DB:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from DB');
  }
}

clearDB();
