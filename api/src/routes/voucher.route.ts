import express from "express";
import { VoucherController } from "../controllers/voucher.controller.js";

const voucherController = new VoucherController();

const router = express.Router();

router.route("/").get(voucherController.getAllVouchers);
router
  .route("/:id")
  .get(voucherController.getVoucherById)
  .patch(voucherController.updateVoucher)
  .patch(voucherController.softDeleteVoucher);
router.route("/create").post(voucherController.createVoucher);

export default router;
