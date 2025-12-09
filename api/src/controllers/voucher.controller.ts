import { type Request, type Response } from "express";
import { VoucherService } from "../services/voucher.service.js";
import type { IVoucher } from "../types/voucher.js";

const voucherService = new VoucherService();

export class VoucherController {
  async createVoucher(req: Request, res: Response) {
    try {
      const data: IVoucher = req.body;

      const voucher = await voucherService.createVoucher(data);

      res.status(201).json({ message: "Success create voucher", voucher });
    } catch (error) {
      res.status(500).json({ message: "Failed to create voucher" });
    }
  }

  async getAllVouchers(req: Request, res: Response) {
    try {
      const voucher = await voucherService.getAllVouchers();

      res.status(200).json(voucher);
    } catch (error) {
      res.status(500).json({ message: "Failed to get all voucher" });
    }
  }

  async getVoucherById(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (!id) return res.status(400).json({ message: "Id is missing" });

      const voucher = await voucherService.getVoucherById(id);

      res.status(200).json(voucher);
    } catch (error) {
      res.status(500).json({ message: "Failed to get voucher" });
    }
  }

  async updateVoucher(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (!id) return res.status(400).json({ message: "Id is missing" });

      const updatedVoucher = await voucherService.updateVoucher(req.body, id);

      res
        .status(201)
        .json({ message: "Success to update voucher", updatedVoucher });
    } catch (error) {
      res.status(500).json({ message: "Failed to update voucher" });
    }
  }

  async softDeleteVoucher(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (!id) return res.status(400).json({ message: "Id is missing" });

      const softDeleteVoucher = await voucherService.softDeleteVoucher(id);

      res.status(201).json({ message: "Success to delete voucher" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete voucher" });
    }
  }
}
