import mongoose from "mongoose";

export const dbConnection = await mongoose
  .connect("mongodb://localhost:27017/jobsSeekersProject")
  .then(() => {
    console.log("connection establisehd successfully");
  })
  .catch((err) => {
    console.log("error in connecting with database");

    process.exit(1);
    throw new Error("Connection failed");
  });
