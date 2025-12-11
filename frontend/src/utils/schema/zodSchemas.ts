import { z } from "zod";
import { getZodUnderMessage, getZodOverMessage } from "@/utils/helpers";

export const assessmentGroupsSchema = ({ isGeneral }: { isGeneral: boolean }) =>
  z
    .object({
      name: z
        .string()
        .min(4, {
          message: "Name must be at least 4 characters.",
        })
        .max(50, {
          message: "Name can't be over 50 characters.",
        }),
      weight: z.coerce
        .number()
        .min(0, { message: getZodUnderMessage("weight", 0) })
        .max(1, { message: getZodOverMessage("weight", 1) }),
      count: z.coerce
        .number()
        .min(1, { message: getZodUnderMessage("count", 1) }),
      drop: z.coerce
        .number()
        .min(0, { message: getZodUnderMessage("drop", 0) }),
      optional: z.boolean(),
      ...(!isGeneral && { conditionGroup: z.string() }),
    })
    .refine((data) => data.drop < data.count, {
      message: "Drop cannot be greater than or equal to count",
      path: ["drop"],
    });

export const assessmentsSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Name must be at least 4 characters.",
    })
    .max(50, {
      message: "Name can't be over 50 characters.",
    }),
  group: z.string(),
  weight: z.coerce
    .number()
    .min(0, { message: getZodUnderMessage("weight", 0) })
    .max(1, { message: getZodOverMessage("weight", 1) }),
  date: z.date().optional(),
});

export const conditionGroupsSchema = z.object({
  symbol: z
    .string()
    .min(1, { message: getZodUnderMessage("symbol", 1) + " characters." }),
});

export const conditionsSchema = z.object({
  lower: z.coerce
    .number()
    .min(0, { message: getZodUnderMessage("lower", 0) })
    .max(100, { message: getZodOverMessage("lower", 100) }),
  formula: z
    .string()
    .min(1, { message: getZodUnderMessage("formula", 1) + " character." }),
  symbol: z.string(),
});

export const personnelsSchema = z.object({
  name: z
    .string()
    .min(3, { message: getZodUnderMessage("name", 3) + " characters." }),
  email: z.email(),
  role: z.enum(["Professor", "TA"]),
});

export const generalInfoSchema = z.object({
  name: z
    .string()
    .min(5, { message: getZodUnderMessage("name", 5) + " characters." }),
  code: z
    .string()
    .min(5, { message: getZodUnderMessage("code", 5) + " characters." }),
  description: z
    .string()
    .min(5, { message: getZodUnderMessage("description", 5) + " characters." }),
});
