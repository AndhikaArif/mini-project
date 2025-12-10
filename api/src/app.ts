import "dotenv/config";

import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import { ErrorMiddleware } from "./middlewares/error.middleware.js";

import eventRoutes from "./routes/event.route.js";
import voucherRoutes from "./routes/voucher.route.js";

class App {
  public app: Application;
  private readonly PORT: number;

  constructor(port: number) {
    this.app = express();
    this.PORT = port;

    this.initializeMiddleware();
    this.initializeStatus();
    this.initializeRoutes();
    this.initializeErrorHandle();
  }

  private initializeMiddleware(): void {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private initializeStatus(): void {
    this.app.get("/status", (req: Request, res: Response) => {
      res
        .status(200)
        .json({ message: "API Running", uptime: Math.round(process.uptime()) });
    });
  }

  private initializeRoutes(): void {
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/events", eventRoutes);
    this.app.use("/api/vouchers", voucherRoutes);
  }

  private initializeErrorHandle(): void {
    this.app.use(ErrorMiddleware.notFound);
    this.app.use(ErrorMiddleware.global);
  }

  public listen(): void {
    this.app.listen(this.PORT, () =>
      console.info(`Server is listening on port ${this.PORT}`)
    );
  }
}

export default App;
