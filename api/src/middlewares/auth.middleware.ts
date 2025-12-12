import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { type CostumJwtPayload } from "../types/auth.type.d.js";

export class AuthMiddleWare {
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const cookieToken = req.cookies?.authenticationToken;
      const authToken = cookieToken;

      if (!authToken)
        return res.status(401).json({ message: "Unauthenthicated" });

      const verifiedToken = jwt.verify(
        authToken,
        process.env.JWT_SECRET as string
      ) as CostumJwtPayload;

      req.currentUser = verifiedToken;

      next();
    } catch (error) {
      res.status(401).json({ message: "Expired or invalid token" });
    }
  }

  static roleGuard(...allowedUser: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const role = req.currentUser?.role;

      if (!role) {
        return res
          .status(401)
          .json({ message: "Unautheticated. Please login first" });
      }

      if (!allowedUser.includes(role)) {
        return res.status(403).json({
          message: "Forbidden, you are not authorized to access this route",
        });
      }

      next();
    };
  }
}

// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const token = req.cookies.get("authenticationToken")?.value;

//   // halaman yang butuh login
//   if (req.nextUrl.pathname.startsWith("/dashboard")) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   return NextResponse.next();
// }
