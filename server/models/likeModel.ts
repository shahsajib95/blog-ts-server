import mongoose from "mongoose";
import moment from "moment";

const LikeSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Types.ObjectId,
    ref: "Blog",
  },
  likedUser: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: String, default: moment().toISOString()},
  updatedAt: { type: String, default: moment().toISOString()},
});

export default mongoose.model("Like", LikeSchema);
