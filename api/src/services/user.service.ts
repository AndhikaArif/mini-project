import { prisma } from "../configs/prisma.config.js";

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
}
