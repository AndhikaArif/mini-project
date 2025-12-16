import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { resetPasswordLimiter } from "../middlewares/rate-limit.middleware.js";

const router = express.Router();
const authController = new AuthController();

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.post(
  "/reset-password/request",
  resetPasswordLimiter,
  authController.requestResetPassword
);
router.post(
  "/reset-password/confirm",
  resetPasswordLimiter,
  authController.confirmResetPassword
);

export default router;
