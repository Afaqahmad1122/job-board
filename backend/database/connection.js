import mongoose from "mongoose";

export const connection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "JOB_PORTAL_WITH_AUTOMATION",
    })
    .then(() => {
      console.log("Connected with database");
    })
    .catch((err) => {
      console.log(`Failed to connect with database ${err}`);
    });
};
