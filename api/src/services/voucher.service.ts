import { PrismaClient } from "../generated/index.js";
import { type IVoucher } from "../types/voucher.d.js";

const prisma = new PrismaClient();

export class VoucherService {
  async createVoucher(data: IVoucher) {
    const voucher = await prisma.voucher.create({ data });

    return voucher;
  }

  async getAllVouchers() {
    const voucher = await prisma.voucher.findMany({
      where: { deletedAt: null },
      select: {
        event: true,
        value: true,
      },
    });

    return voucher;
  }

  async getVoucherById(id: string) {
    const voucher = await prisma.voucher.findUnique({
      where: { id },
      include: { event: { select: { name: true } } },
    });

    return voucher;
  }

  async updateVoucher(data: Partial<IVoucher>, id: string) {
    const voucher = await prisma.voucher.findUnique({ where: { id } });

    if (!voucher) throw new Error("Voucher not found");

    const updatedVoucher = await prisma.voucher.update({ where: { id }, data });

    return updatedVoucher;
  }

  async softDeleteVoucher(id: string) {
    const voucher = await prisma.voucher.findUnique({ where: { id } });

    if (!voucher) throw new Error("Voucher not found");

    const updatedVoucher = await prisma.voucher.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return updatedVoucher;
  }
}
