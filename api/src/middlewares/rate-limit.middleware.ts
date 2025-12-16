import rateLimit from "express-rate-limit";

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // max 5 request
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many reset password requests. Please try again later.",
  },
});
