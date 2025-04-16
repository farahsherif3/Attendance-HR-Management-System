import { config } from "dotenv";
import mongoose from "mongoose";


const connection = async () => {
  try {
    const conn = await mongoose.connect(process.env.URI);

    console.log(`✅ DB Connected: ${conn.connection.name} at ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit process on failure
  }
};

export default connection;
