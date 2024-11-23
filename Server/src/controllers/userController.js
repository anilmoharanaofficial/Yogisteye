import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import validateEmail from "../utils/validateEmail.js";
import User from "../models/userModel.js";
import crypto from "crypto";
import { cookieOptions } from "../helper/helper.js";

/***************************  SIGNUP  ***************************/
const signup = catchAsync(async (req, res, next) => {
  const { name, email, phone } = req.body;

  // Validate Required Fields
  if (!name || !email || !phone)
    return next(new AppError("All fields are required", 400));

  // Validate Email
  if (!validateEmail(email))
    return next(new AppError("Please enter a valid email address", 400));

  // Check if User Exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // If the user exists but is not verified
    if (!existingUser.isVerified) {
      // Check if OTP has expired
      if (
        existingUser.authOtpExpiry &&
        existingUser.authOtpExpiry < Date.now()
      ) {
        // If OTP expired, generate a new OTP
        const otp = existingUser.generateAuthOtp();

        await existingUser.save();

        return res.status(200).json({
          message: "A new OTP has been sent to your email. Please verify.",
        });
      }

      // If OTP is still valid
      return next(
        new AppError(
          "User already exists but is not verified. Please check your email for the OTP.",
          400
        )
      );
    }

    // If the user is already verified
    return next(new AppError("User already exists. Please log in.", 400));
  }

  // Create New User
  const user = new User({
    name,
    email,
    phone,
  });

  // Generate The OTP
  const otp = user.generateAuthOtp();

  // Save User
  await user.save();

  // Respond with Success Message
  res.status(200).json({
    message: "OTP sent to your email. Please verify.",
  });
});

/***************************  LOGIN  ***************************/
const login = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  //Validate User
  const user = await User.findOne({ email, isVerified: true });
  if (!user) return next(new AppError("Email not registered", 500));

  // Generate Verification OTP
  const otp = user.generateAuthOtp();

  // Save Generated Verification OTP
  await user.save();

  res.status(200).json({
    message: "OTP sent to your email. Please verify.",
  });
});

/***************************  VERIFY OTP  ***************************/
const verifyOTP = catchAsync(async (req, res, next) => {
  const { otp } = req.body;
  if (!otp) return next(new AppError("OTP is required.", 400));

  // Match the OTP
  const verify = crypto.createHash("sha256").update(otp).digest("hex");

  // Find the user with the OTP and check expiry
  const user = await User.findOne({
    authOtp: verify,
    authOtpExpiry: { $gt: Date.now() },
  });

  if (!user)
    return next(new AppError("Invalid or expired OTP. Please try again.", 400));

  // Mark user as verified
  user.isVerified = true;
  user.authOtp = null;
  user.authOtpExpiry = null;
  await user.save();

  // Set Cookie
  const token = await user.generateJWTToken();
  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    message: "OTP verified successfully. You are now logged in.",
  });
});

/***************************  RESEND OTP  ***************************/
const resendtOtp = catchAsync(async (req, res, next) => {});

/***************************  LOGOUT  ***************************/
const logout = catchAsync(async (req, res, next) => {
  // Clear Cookie
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    message: "Logged Out Successfully",
  });
});

export { signup, verifyOTP, login, logout };
