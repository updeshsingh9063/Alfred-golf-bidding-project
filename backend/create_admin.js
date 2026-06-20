require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User.model');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const email = 'updeshsingh9063@gmail.com';
    const password = 'Senu@9063';

    let user = await User.findOne({ email });

    if (user) {
      user.role = 'admin';
      user.password = password; // it will be hashed by pre-save hook
      await user.save();
      console.log('User already existed. Updated role to admin and updated password.');
    } else {
      user = new User({
        firstName: 'Updesh',
        lastName: 'Singh',
        email: email,
        password: password,
        role: 'admin',
        isActive: true,
        isEmailVerified: true
      });
      await user.save();
      console.log('Created new admin user successfully.');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from DB');
  }
}

createAdmin();
