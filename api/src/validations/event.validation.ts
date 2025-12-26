import { z } from "zod";
import { CategoryOption, LocationOption } from "../generated/index.js";

export const updateEventSchema = z
  .object({
    name: z
      .string()
      .min(3, "Event name must be at least 3 characters")
      .optional(),

    price: z.number().min(0, "Price must be positive").optional(),

    totalSeats: z
      .number()
      .int()
      .min(1, "Total seats must be at least 1")
      .optional(),

    startTime: z.string().datetime().optional(),

    endTime: z.string().datetime().optional(),
  })
  .refine(
    (data) =>
      !data.startTime ||
      !data.endTime ||
      new Date(data.endTime) > new Date(data.startTime),
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export type UpdateEventDTO = z.infer<typeof updateEventSchema>;

export const eventQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(8),
  search: z.string().optional(),
  category: z.enum(CategoryOption).optional(),
  location: z.enum(LocationOption).optional(),
  sortBy: z.enum(["newest", "latest", "startTime"]).default("startTime"),
});

export type IEventSearch = z.infer<typeof eventQuerySchema>;
