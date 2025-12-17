import express from "express";
import { UserController } from "../controllers/user.controller.js";
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";
import { fileUpload } from "../middlewares/file-upload.middleware.js";

const router = express.Router();
const userController = new UserController();

router
  .route("/get-current-user")
  .get(AuthMiddleWare.verifyToken, userController.getCurrentUser);

router
  .route("/profile")
  .put(
    AuthMiddleWare.verifyToken,
    fileUpload().single("profilePicture"),
    userController.updateProfile
  );

router
  .route("/change-password")
  .put(AuthMiddleWare.verifyToken, userController.changePassword);

export default router;
