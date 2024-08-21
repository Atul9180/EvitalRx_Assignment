import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Load environment variables from .env file
const mongoURI = process.env.MONGO_URI;

const connectToDb = async () => {
  try {
    mongoose.set("strictQuery", true); //to set only existing schema field names valid in query..ignore rest fields
    await mongoose.connect(mongoURI);
    console.log("DB connected successfully");
  } catch (error) {
    console.log("Database connection error: ", error);
    process.exit(1);
  }
};

export default connectToDb;
