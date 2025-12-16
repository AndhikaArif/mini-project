import express from "express";
import { PaymentController } from "../controllers/payment.controller.js";
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";
import { RoleType } from "../generated/index.js";
import { fileUpload } from "../middlewares/file-upload.middleware.js";

const paymentController = new PaymentController();
const upload = fileUpload();

const router = express.Router();

router
  .route("/create")
  .post(
    AuthMiddleWare.verifyToken,
    AuthMiddleWare.roleGuard(RoleType.CUSTOMER),
    paymentController.createPayment
  );
router
  .route("/:id/payments")
  .get(
    AuthMiddleWare.verifyToken,
    AuthMiddleWare.roleGuard(RoleType.EVENT_ORGANIZER),
    paymentController.getAllPayment
  );
router
  .route("/:id")
  .get(AuthMiddleWare.verifyToken, paymentController.getPaymentById)
  .put(
    AuthMiddleWare.verifyToken,
    AuthMiddleWare.roleGuard(RoleType.CUSTOMER),
    upload.single("paymentProof"),
    paymentController.updatePaymentProof
  );

router
  .route("/:id/status")
  .put(
    AuthMiddleWare.verifyToken,
    AuthMiddleWare.roleGuard(RoleType.EVENT_ORGANIZER),
    paymentController.updatePaymentStatus
  );

export default router;
