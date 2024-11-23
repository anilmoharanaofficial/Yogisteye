import { model, Schema } from "mongoose";
import JWT from "jsonwebtoken";
import { randomInt } from "crypto";
import crypto from "crypto";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      trim: true,
      minlength: [5, "Name must be at least 5 charchter"],
      maxlength: [50, "Name should be less that 50 charchter"],
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{12}$/, "Please provide a valid 10-digit phone number"],
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "SUPER_ADMIN"],
      default: "USER",
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    authOtp: {
      type: String,
      required: false,
    },
    authOtpExpiry: {
      type: Date,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hooks
userSchema.methods = {
  // Generate JWT Token Fo Set Cookie
  generateJWTToken: async function () {
    return JWT.sign(
      {
        id: this._id,
        email: this.email,
        role: this.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "90d" }
    );
  },

  // Generate Auth OTP
  generateAuthOtp: async function () {
    const otp = randomInt(100000, 1000000).toString();
    this.authOtp = crypto.createHash("sha256").update(otp).digest("hex");
    this.authOtpExpiry = Date.now() + 15 * 60 * 1000;
    return otp;
  },
};

const User = model("User", userSchema);

export default User;
