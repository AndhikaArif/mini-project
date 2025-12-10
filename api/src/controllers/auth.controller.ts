import { type Request, type Response, type NextFunction } from "express";

import { AuthService } from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, username, email, password, referralCode } =
        registerSchema.parse(req.body);

      const user = await authService.register({
        name,
        username,
        email,
        password,
        referralCode,
      });

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = loginSchema.parse(req.body);

      const user = await authService.validateUser(username, password);
      const authToken = await authService.generateToken(user);

      res
        .status(200)
        .cookie("authenticationToken", authToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24, // 1 hari
        })
        .json({
          message: "Login success",
          user: {
            id: user.id,
            name: user.name,
            role: user.role,
          },
        });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response) {
    res
      .status(200)
      .clearCookie("authenticationToken")
      .json({ message: "Logout success" });
  }
}
