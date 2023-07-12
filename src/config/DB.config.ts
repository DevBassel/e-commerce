import mongoose from "mongoose";

export async function dbConnect(CB: () => void) {
  try {
    await mongoose.connect(String(process.env.DB_URI));
    console.log("database connected");
    CB();
  } catch (error) {
    console.log(error);
  }
}
