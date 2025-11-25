// models/AuthUser.js
import mongoose from "mongoose";

const AuthUserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // custom ID
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  district: { type: String, required: true },
  password: { type: String, required: true },

});

const AuthUser = mongoose.model("AuthUser", AuthUserSchema);
export default AuthUser;
