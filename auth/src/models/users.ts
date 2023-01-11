import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: ObjectId,
    ref: "users",
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  photos: [String],
  price: {
    type: Number,
    required: true,
  },
  rooms: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("users", userSchema);

export default User;
