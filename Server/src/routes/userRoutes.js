import { Router } from "express";
import {
  login,
  logout,
  signup,
  verifyOTP,
} from "../controllers/userController.js";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", logout);

export default router;
