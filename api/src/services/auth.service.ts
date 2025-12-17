import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../configs/prisma.config.js";
import { type IRegister, type IExistingUser } from "../types/auth.type.d.js";
import { AppError } from "../errors/app.error.js";
import crypto from "crypto";
import { EmailUtil } from "../utils/email.util.js";

const emailUtil = new EmailUtil();

export class AuthService {
  async register({ name, username, email, password, referralCode }: IRegister) {
    // Cek apakah username atau email sudah dipakai
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
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

    const result = await prisma.$transaction(async (tx) => {
      // Generate referral code untuk user baru
      const generateNewReferral = () => {
        const joinUsername = username
          .replace(/[^a-zA-Z0-9]/g, "")
          .toUpperCase();
        const random = Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase();
        return `${joinUsername}-${random}`;
      };

      // Cek apakah referral code yang baru dibuat untuk user baru ada yang sama dengan referral code user lama
      let finalReferralCode = "";

      while (true) {
        const code = generateNewReferral();
        const exists = await tx.user.findUnique({
          where: { referralCode: code },
        });

        if (!exists) {
          finalReferralCode = code;
          break;
        }
      }

      // buat user baru
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          username,
          email,
          password: hashedPassword,
          referralCode: finalReferralCode,
          ...(referredById && { referredById }),
          profilePicture:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgsaRe2zqH_BBicvUorUseeTaE4kxPL2FmOQ&s",
        },
        omit: { password: true },
      });

      // generate coupon code untuk user baru
      const generateNewCoupon = `WELCOME-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

      // Cek apakah coupon code yang baru dibuat untuk user baru ada yang sama dengan coupon code user lama
      let couponCode = "";

      while (true) {
        const code = generateNewCoupon;
        const exist = await tx.coupon.findUnique({
          where: { code },
        });

        if (!exist) {
          couponCode = code;
          break;
        }
      }

      // kasih coupon ke user baru
      if (referredById) {
        await tx.coupon.create({
          data: {
            userId: user.id,
            code: couponCode,
            discount: 10000,
            expiredAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 hari
          },
        });

        // kasih point ke user yang referral nya digunakan
        await tx.point.create({
          data: {
            userId: referredById,
            amount: 10000,
            expiredAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 hari
          },
        });
      }

      return user;
    });

    return result;
  }

  async validateUser(username: string, password: string) {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) throw new AppError(401, "Username or password is wrong");

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isValidPassword)
      throw new AppError(401, "Username or password is wrong");

    const { password: _, ...safeUser } = existingUser;
    return safeUser;
  }

  async generateToken(existingUser: IExistingUser) {
    const payload = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };

    const authToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "24h",
    });

    return authToken;
  }

  async requestResetPasswordByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // bukan throw error karena nanti ANTI ENUMERATION
    if (!user) return;

    // invalidate token lama
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: null,
        resetTokenExp: null,
      },
    });

    // generate token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // hash token
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // simpan token + expire 15 menit
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExp: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    // kirim email (pakai RAW token)
    await emailUtil.sendResetPasswordEmail(user.email, rawToken);
  }

  async confirmResetPassword(token: string, newPassword: string) {
    // hash token dari user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // cari user + cek expiry
    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExp: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new AppError(400, "Invalid or expired reset token");
    }

    // hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // update password + hapus token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      },
    });
  }
}
