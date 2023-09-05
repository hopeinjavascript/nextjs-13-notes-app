import mongoose from 'mongoose';

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      appName: 'Next JS Notes App',
      dbName: 'notes-app',
    });
    console.log('Connected to Database');
  } catch (error) {
    console.error(error);
  }
}

export default connectToDB;
