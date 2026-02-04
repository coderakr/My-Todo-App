import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MONGODB connected");
  } catch (error) {
    console.log("Error: ", error);
  }
};
