import "dotenv/config";

import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import eventRoutes from "./routes/event.route.js";

class App {
  public app: Application;
  private readonly PORT: number;

  constructor(port: number) {
    this.app = express();
    this.PORT = port;

    this.initializeMiddleware();
    this.initializeStatus();
  }

  private initializeMiddleware(): void {
    this.app.use(express.json());
  }

  private initializeStatus(): void {
    this.app.get("/status", (req: Request, res: Response) => {
      res
        .status(200)
        .json({ message: "API Running", uptime: Math.round(process.uptime()) });
    });
  }

  private initializeRoutes(): void {
    this.app.use("/api/events", eventRoutes);
  }

  public listen(): void {
    this.app.listen(this.PORT, () =>
      console.info(`Server is listening on port ${this.PORT}`)
    );
  }
}

export default App;
