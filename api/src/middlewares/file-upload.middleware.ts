import multer from "multer";
import path from "path";
import { AppError } from "../errors/app.error.js";

export function fileUpload() {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "public");
      },
      filename: (req, file, cb) => {
        const uniqueSuffix =
          "Festivo" + "-" + Math.round(Math.random() * 1e9) + Date.now();
        const fileName =
          file.fieldname.toUpperCase() +
          "-" +
          uniqueSuffix +
          path.extname(file.originalname);

        cb(null, fileName);
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 5,
      files: 5,
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        cb(new AppError(400, "Only image files allowed"));
      } else {
        cb(null, true);
      }
    },
  });
}
