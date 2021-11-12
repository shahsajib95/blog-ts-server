import mongoose from "mongoose";

const URI = process.env.MONGODB_URL;

mongoose.connect(`${URI}`).then(
  () => {
   console.log('Connected to DB')
  },
  (err) => {
    throw err;
  }
);
