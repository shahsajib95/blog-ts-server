import mongoose from "mongoose";
import moment from 'moment'

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title."],
    maxLength: [120, "Title can not be more than 120 characters."],
  },
  body: {
    type: String,
    required: [true, "Please add body"],
  },
  thumbnail: {
    type: String,
    required: [true, "Please add a thumbnail."],
  },
  tags:{
    type: String,
  },
  love:{
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: String, default: moment().toISOString()},
  updatedAt: { type: String, default: moment().toISOString()},
});

export default mongoose.model("Blog", blogSchema);
