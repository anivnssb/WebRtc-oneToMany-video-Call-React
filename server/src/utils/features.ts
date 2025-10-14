import mongoose from "mongoose";

export const connectDB = async (uri: string) => {
  try {
    const connecton = await mongoose.connect(uri, { dbName: "Video_Calling" });
    console.log(
      `${connecton.connection.host} connected to ${connecton.connection.port}`
    );
  } catch (error) {
    console.log(error);
  }
};
