import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add your name."],
    maxLength: [20, "Name can not be more than 20 characters."],
  },

  email: {
    type: String,
    required: [true, "Please add your email."],
    trim: true,
  },
  avatar: {
    type: String,
    default:
      "https://media.istockphoto.com/vectors/avatar-5-vector-id1131164548?k=20&m=1131164548&s=612x612&w=0&h=ODVFrdVqpWMNA1_uAHX_WJu2Xj3HLikEnbof6M_lccA=",
  },
  password: {
    type: String,
    required: [true, "Please add your email."],
    trim: true,
    minLength: [6, "Password must be atleast 6 characters"],
  },
  role: {
    type: String,
    default: "normal",
  },
  createdAt: { type: String, default: new Date() },
  updatedAt: { type: String, default: new Date() },
});

export default mongoose.model("User", userSchema);
