import mongoose, { Document, Schema, Model, Types, UpdateQuery } from "mongoose";
import { genSalt, hash } from "bcryptjs";
import { CustomError } from "@/utils/ErrorHandler";

export type UserRole = "admin" | "seller" | "customer";
export type AuthProvider = "credentials" | "google" | "github";

export interface IAddress {
  title: string;
  fullAddress: string;
  phone: string;
  label?: string;
}

export interface IUser extends Document {
  userName: string;
  email: string;
  password?: string;
  role: UserRole;
  addresses?: IAddress[];
  image?: string;
  provider?: AuthProvider;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDoc = {
  _id: Types.ObjectId;
  userName: string;
  email: string;
  role: UserRole;
  addresses?: IAddress[];
  image?: string;
  provider?: AuthProvider;
  createdAt?: Date;
  updatedAt?: Date;
};

const usersSchema: Schema<IUser> = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      trim: true,
      minlength: [5, "A userName must have at least 5 characters."],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["customer", "seller", "admin"],
        message: "Role must be one of: customer, seller, admin",
      },
      default: "customer",
    },
    image: { type: String },
    provider: {
      type: String,
      enum: ["credentials", "google", "github"],
      default: "credentials",
    },
    addresses: [
      {
        title: { type: String, required: true },
        fullAddress: { type: String, required: true },
        phone: { type: String, required: true },
        label: { type: String, default: "Home" },
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
  },
);

usersSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

usersSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate() as UpdateQuery<IUser>;
  if (update?.$set?.password) {
    const salt = await genSalt(10);
    update.$set.password = await hash(update.$set.password, salt);
  }
});

export const usersModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", usersSchema);

function omitId<T extends { _id?: unknown }>(data: T): Omit<T, "_id"> {
  const { _id: _omit, ...rest } = data;
  return rest;
}

class Users {
  async showAll(): Promise<UserDoc[]> {
    try {
      return await usersModel
        .find()
        .select("-password")
        .lean<UserDoc[]>();
    } catch {
      throw new CustomError("Failed to fetch users", 500, "users.showAll");
    }
  }

  async showOne(query: Record<string, unknown>): Promise<UserDoc | null> {
    try {
      return await usersModel
        .findOne(query)
        .select("-password")
        .lean<UserDoc | null>();
    } catch {
      throw new CustomError(
        `DB error in users.showOne: ${JSON.stringify(query)}`,
        500,
        "users.showOne",
      );
    }
  }

  async create(obj: Partial<IUser>): Promise<UserDoc> {
    try {
      const user = await usersModel.create(obj);
      const userObject = user.toObject();
      const { password: _password, ...userWithoutPassword } = userObject;
      return userWithoutPassword;
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        err.code === 11000
      ) {
        throw new CustomError(
          "Email or username already exists",
          400,
          "users.create",
        );
      }
      throw new CustomError("Failed to create user", 500, "users.create");
    }
  }

  async delete(id: string): Promise<UserDoc | null> {
    try {
      return await usersModel
        .findByIdAndDelete(id)
        .select("-password")
        .lean<UserDoc | null>();
    } catch {
      throw new CustomError("Failed to delete user", 500, "users.delete");
    }
  }

  async update(
    id: string,
    data: Partial<IUser> & { _id?: unknown },
  ): Promise<UserDoc | null> {
    try {
      const updateData = omitId(data);
      return await usersModel
        .findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
        .select("-password")
        .lean<UserDoc | null>();
    } catch {
      throw new CustomError("Failed to update user", 500, "users.update");
    }
  }
}

export default Users;
