import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../configs/prisma.config.js";
import { type IRegister, type IExistingUser } from "../types/auth.type.d.js";
import { AppError } from "../errors/app.error.js";

export class AuthService {
  async register({ name, username, email, password, referralCode }: IRegister) {
    // Cek apakah username atau email sudah dipakai
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username, email }] },
    });

    if (existingUser) throw new AppError(400, "User already exist");

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    let referredById: string | null = null;

    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
      });

      if (!referrer) throw new AppError(400, "Invalid referral code");

      referredById = referrer.id;
    }

    // Generate referral code untuk user baru
    const generateNewReferral = () => {
      const joinUsername = username.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      const random = Math.random().toString(36).substring(2, 10).toUpperCase();
      return `${joinUsername}-${random}`;
    };

    // Cek apakah referral code yang baru dibuat untuk user baru ada yang sama dengan referral code user lama
    let finalReferralCode = "";

    while (true) {
      const code = generateNewReferral();
      const exists = await prisma.user.findUnique({
        where: { referralCode: code },
      });

      if (!exists) {
        finalReferralCode = code;
        break;
      }
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        username,
        email,
        password: hashedPassword,
        referralCode: finalReferralCode,
        ...(referredById && { referredById }),
      },
      omit: { password: true },
    });

    return user;
  }

  async validateUser(username: string, password: string) {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) throw new AppError(400, "Username or password is wrong");

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isValidPassword)
      throw new AppError(400, "Username or password is wrong");

    return existingUser;
  }

  async generateToken(existingUser: IExistingUser) {
    const payload = {
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };

    const authToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    return authToken;
  }
}
