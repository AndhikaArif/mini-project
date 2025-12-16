import cloudinary from "../configs/cloudinary.config.js";
import fs from "fs/promises";
import { AppError } from "../errors/app.error.js";

export class FileUpload {
  async uploadToCloudinary(filePath: string) {
    try {
      const uploadResult = await cloudinary.uploader.upload(filePath);

      return uploadResult.secure_url;
    } finally {
      await fs.unlink(filePath);
    }
  }

  async uploadSingle(filePath: string) {
    return await this.uploadToCloudinary(filePath);
  }

  async uploadArray(filePaths: Express.Multer.File[]) {
    return Promise.all(
      filePaths.map((file) => {
        return this.uploadToCloudinary(file.path);
      })
    );
  }

  async uploadFields(fields: Record<string, Express.Multer.File[]>) {
    const result: Record<string, string[]> = {};

    for (const fieldName in fields) {
      const filePaths = fields[fieldName];
      if (!filePaths) throw new AppError(400, "File paths is missing");

      result[fieldName] = await this.uploadArray(filePaths);
    }

    return result;
  }
}
