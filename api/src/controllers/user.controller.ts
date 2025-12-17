import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service.js";
import cloudinary from "../configs/cloudinary.config.js";
import fs from "fs";

const userService = new UserService();

export class UserController {
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = await userService.getCurrentUser(req.currentUser!.id);

      res.status(200).json(currentUser);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser!.id;
      const { name, bio } = req.body;

      let profilePicture: string | undefined;

      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "users/profile",
          transformation: [
            { width: 300, height: 300, crop: "fill" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        });

        profilePicture = uploadResult.secure_url;

        // hapus file lokal
        fs.unlinkSync(req.file.path);
      }

      const user = await userService.updateUser(userId, {
        name,
        bio,
        ...(profilePicture && { profilePicture }),
      });

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser!.id;
      const { oldPassword, newPassword } = req.body;

      await userService.changePassword(userId, oldPassword, newPassword);

      res.clearCookie("authenticationToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res
        .status(200)
        .json({ message: "Password changed successfully. Please login again" });
    } catch (error) {
      next(error);
    }
  }
}
