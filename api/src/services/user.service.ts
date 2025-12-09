import { prisma } from "../configs/prisma.config.js";

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  referralCodeUsed?: string; // optional
}) {
  return prisma.$transaction(async (tx: any) => {
    // generate referral code baru untuk user ini
    const newReferralCode = crypto.randomUUID().slice(0, 8);

    // bikin user baru
    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        referralCode: newReferralCode,
      },
    });

    // kalau pakai referral code orang lain
    if (data.referralCodeUsed) {
      const referrer = await tx.user.findUnique({
        where: { referralCode: data.referralCodeUsed },
      });

      if (!referrer) throw new Error("Referral code tidak valid");

      // referrer dapat 10.000 poin
      await tx.point.create({
        data: {
          userId: referrer.id,
          amount: 10000,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      });

      // user baru dapat coupon (diskon dari sistem)
      await tx.coupon.create({
        data: {
          userId: user.id,
          discountAmount: 10000,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      });
    }

    return user;
  });
}
