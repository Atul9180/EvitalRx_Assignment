import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    mobile: { type: String },
    email: { type: String, unique: true },
    dob: { type: Date },
    gender: { type: String },
    address: { type: String },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationCode: String, // Store OTP for verification
    verificationCodeExpiresAt: Date, // OTP expiry time
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
  },
  { timestamp: true }
);

export const User = mongoose.model("User", userSchema);
