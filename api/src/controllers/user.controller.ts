import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service.js";

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

      const user = await userService.updateUser(userId, { name, bio });

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
