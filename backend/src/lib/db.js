import mongoose from "mongoose";

export const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected successfully ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error : ${error}`);
    process.exit(1);
  }
};
