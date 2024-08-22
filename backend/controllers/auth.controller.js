import { User } from "../models/user.model.js";
import { generateJWTAndSetCookie } from "../utils/generateJWTAndSetCookie.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../config/emailSendHelperFunctions.js";

//signup;
export const signup = async (req, res) => {
  const { name, mobile, email, dob, gender, address, password } = req.body;
  try {
    //check if user alreadyExists:
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    //new user: bcryt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email 6 digit verification code:
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpiresAt = Date.now() + 24 * 60 * 60 * 1000; //  valid for 24 hours

    // Create user
    const user = new User({
      name,
      mobile,
      email,
      dob,
      gender,
      address,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiresAt,
    });

    await user.save();
    await sendVerificationEmail(user.email, verificationCode);

    // jwt Token to verify account:
    generateJWTAndSetCookie(res, user._id);

    res.status(201).json({
      success: true,
      message:
        "User created successfully, Email Verification Code sent to email",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//verify email:
export const verifyEmail = async (req, res) => {
  const { code, email } = req.body;

  try {
    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    await user.save();

    //navigate to ;;;;;;''''''======????

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateJWTAndSetCookie(res, user._id);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//logout user:
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Generate reset password token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//check authentication:
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// update user data
export const updateProfile = async (req, res) => {
  const { name, mobile, dob, gender, address } = req.body;
  try {
    const email = req.user.email; // Assuming req.user contains email from authentication middleware

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only update provided fields
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (mobile) updatedFields.mobile = mobile;
    if (dob) updatedFields.dob = dob;
    if (gender) updatedFields.gender = gender;
    if (address) updatedFields.address = address;

    // Update the user document with new data
    Object.assign(user, updatedFields);

    // Save the updated user document
    await user.save();

    res.status(202).json({
      success: true,
      message: "Profile updated successfully",
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
