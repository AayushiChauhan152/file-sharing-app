import mongoose from "mongoose";
const database = mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.log(error);
  });

export default database;
