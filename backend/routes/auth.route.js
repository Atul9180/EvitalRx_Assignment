import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  updateProfile,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//desc: authentication
//path: /api.auth/check-auth
router.get("/check-auth", verifyToken, checkAuth);

//desc: SignUp route
//path: /api/auth/signup
// router.post("/signup", signupValidationRules, validate, signup);
router.post("/signup", signup);

//desc: Login route
//path: /api/auth/login
router.post("/login", login);

//desc: Logout route
//path: /api/auth/logout
router.post("/logout", logout);

//desc: verify email
//path: /api/auth/verify-email
router.post("/verify-email", verifyEmail);

//desc: forgot password
//path: /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

//desc: reset password
//path: /api/auth/reset-password/:token
router.post("/reset-password/:token", resetPassword);

//desc: update user Data
//path: /api/auth/updateProfileData
router.post("/updateProfileData", updateProfile);

export default router;
