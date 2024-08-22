import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Load environment variables from .env file
const mongoURI = process.env.MONGO_URI;

const connectToDb = async () => {
  try {
    mongoose.set("strictQuery", true); //to set only existing schema field names valid in query..ignore rest fields
    const conn = await mongoose.connect(mongoURI);
    console.log("DB connected successfully to: ", conn.connection.host);
  } catch (error) {
    console.log("Database connection error: ", error.message);
    process.exit(1); // status code 1 is failure and 0 is success
  }
};

export default connectToDb;
