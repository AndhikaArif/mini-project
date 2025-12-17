import { prisma } from "../configs/prisma.config.js";
import bcrypt from "bcryptjs";
import { AppError } from "../errors/app.error.js";

export class UserService {
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true },
    });

    if (!user) return null;

    const [pointSum, activeCoupon] = await Promise.all([
      prisma.point.aggregate({
        where: {
          userId,
          expiredAt: { gt: new Date() },
        },
        _sum: { amount: true },
      }),

      prisma.coupon.findFirst({
        where: {
          userId,
          used: false,
          expiredAt: { gt: new Date() },
        },
        select: {
          code: true,
          discount: true,
          expiredAt: true,
        },
      }),
    ]);

    return {
      ...user,
      pointBalance: pointSum._sum.amount ?? 0,
      coupon: activeCoupon
        ? {
            code: activeCoupon.code,
            discount: activeCoupon.discount,
            expiredAt: activeCoupon.expiredAt,
          }
        : null,
    };
  }

  async updateUser(
    id: string,
    data: { name: string; bio: string | null; profilePicture?: string }
  ) {
    const updateUser = await prisma.user.update({
      where: { id },
      data,
      omit: { password: true },
    });

    return updateUser;
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    if (!oldPassword || !newPassword) {
      throw new AppError(400, "Old password and new password are required");
    }

    if (newPassword.length < 5) {
      throw new AppError(400, "Password must be at least 5 characters");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new AppError(404, "User not found");

    const isValid = await bcrypt.compare(oldPassword, user.password);

    if (!isValid) {
      throw new AppError(400, "Old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return true;
  }
}
