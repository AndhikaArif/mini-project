import "dotenv/config";

import App from "./app.js";
import { startPaymentExpirationJob } from "./jobs/payment-expiration.job.js";

startPaymentExpirationJob();

const PORT: number = Number(process.env.PORT) || 8000;

const server = new App(PORT);
server.listen();
