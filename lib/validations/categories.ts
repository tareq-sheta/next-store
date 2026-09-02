import z from "zod";
import mongoose from "mongoose";

export const CreateCategorySchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    parentId: z
      .string()
      .refine((v) => mongoose.Types.ObjectId.isValid(v))
      .optional(),
  })
  .strict();

export const CATEGORY_DEFINITIONS = [
  {
    name: "Phones",
    slug: "phones",
    icon: "https://img.icons8.com/ios/50/000000/iphone.png",
  },
  {
    name: "SmartWatches",
    slug: "smartwatch",
    icon: "https://img.icons8.com/?size=100&id=22193&format=png&color=000000",
  },
  {
    name: "Cameras",
    slug: "cameras",
    icon: "https://img.icons8.com/ios/50/000000/camera.png",
  },
  {
    name: "Headphones",
    slug: "headphones",
    icon: "https://img.icons8.com/ios/50/000000/headphones.png",
  },
  {
    name: "Computers",
    slug: "computers",
    icon: "https://img.icons8.com/ios/50/000000/imac.png",
  },
  {
    name: "Gaming",
    slug: "gaming",
    icon: "https://img.icons8.com/ios/50/000000/controller.png",
  },
  {
    name: "Others",
    slug: "others",
    icon: "https://img.icons8.com/ios/50/000000/plus--v1.png",
  },
] as const;

// Derived, not hand-duplicated — this is the flat string array every
// existing consumer (Zod, Mongoose, ProductCategory) already expects.
// Adding/renaming a category only ever needs to happen in
// CATEGORY_DEFINITIONS above; this stays in sync automatically.
export const VALID_CATEGORIES = CATEGORY_DEFINITIONS.map((c) => c.slug) as [
  (typeof CATEGORY_DEFINITIONS)[number]["slug"],
  ...(typeof CATEGORY_DEFINITIONS)[number]["slug"][],
];

export type ProductCategory = (typeof CATEGORY_DEFINITIONS)[number];
