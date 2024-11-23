import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const MONGO_DB_URI = process.env.MONGO_DB_URI;

const connectToDb = async () => {
  try {
    const { connection } = mongoose.connect(MONGO_DB_URI);
    if (connection) console.log(`Connected To DB: ${connection.host}`);
  } catch (error) {
    console.log("Error in DB Connection", error);
    process.exit(1);
  }
};

export default connectToDb;
