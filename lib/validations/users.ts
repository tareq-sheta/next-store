import z from "zod";

const MAX_PAGE_SIZE = 50;

export const ListUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(MAX_PAGE_SIZE).default(20),
});

//-------
export const AddressSchema = z.object({
  title: z.string().min(1, "Address title is required"),
  fullAddress: z.string().min(1, "Full address is required"),
  phone: z.string().min(1, "Phone is required"),
  label: z.string().optional(),
});

export const RegisterSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(2, "Username must be at least 2 characters"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("Invalid email format")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    provider: z.enum(["credentials", "google", "github"]).optional(),
    image: z.string().pipe(z.url("Image must be a valid URL")).optional(),
    addresses: z.array(AddressSchema).optional(),
    role: z.enum(["customer", "seller"]).optional().default("customer"),
  })
  .refine(
    (data) =>
      (data.provider ?? "credentials") !== "credentials" || !!data.password,
    {
      message: "Password is required for credentials signup",
      path: ["password"],
    },
  );

export const PasswordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

// `phone` removed — there's no top-level phone path on the User schema
// (it only exists inside each entry of `addresses`), so with
// `strict: true` this was accepted by Zod, sent to Mongoose, and
// silently dropped on every save with no error.
export const UpdateProfileSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(2, "Username must be at least 2 characters")
      .optional(),
    email: z.email("Invalid email format").trim().toLowerCase().optional(),
    image: z.url("Image must be a valid URL").optional(),
    addresses: z.array(AddressSchema).optional(),
    selectedAddressIndex: z.number().int().nonnegative().optional(),
  })
  .strict();
