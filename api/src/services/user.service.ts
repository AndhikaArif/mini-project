import { prisma } from "../configs/prisma.config.js";

export class UserService {
  async getCurrentUser(userId: string) {
    const result = await prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true },
    });
    return result;
  }
}
