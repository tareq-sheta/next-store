import mongoose, {
  Document,
  Schema,
  Model,
  Types,
  UpdateQuery,
} from "mongoose";
import { genSalt, hash } from "bcryptjs";
import { CustomError } from "@/utils/ErrorHandler";
import { PaginatedResult, UserRole } from "@/types";
import { isValidObjectId, omitId } from "@/utils/mongoose";

export type AuthProvider = "credentials" | "google" | "github";

/**
 * Represents a user's address.
 */
export interface IAddress {
  /** The title of the address (e.g., "Home", "Office") */
  title: string;
  /** The full physical address */
  fullAddress: string;
  /** Contact phone number for the address */
  phone: string;
  /** Optional label for the address */
  label?: string;
}

/**
 * Mongoose document interface for a User.
 */
export interface IUser extends Document {
  /** The unique username */
  userName: string;
  /** The unique email address */
  email: string;
  /** The hashed password (optional if using OAuth) */
  password?: string;
  /** The user's role (customer, seller, admin) */
  role: UserRole;
  /** Array of user addresses */
  addresses?: IAddress[];
  /** Index of the currently selected address */
  selectedAddressIndex?: number | null;
  /** URL to the user's avatar image */
  image?: string;
  /** The authentication provider used */
  provider?: AuthProvider;
  /** Creation timestamp */
  createdAt?: Date;
  /** Last update timestamp */
  updatedAt?: Date;
}

/**
 * Plain object representation of a User, without Mongoose Document properties.
 */
export type UserDoc = {
  _id: Types.ObjectId;
  userName: string;
  email: string;
  role: UserRole;
  addresses?: IAddress[];
  selectedAddressIndex?: number | null;
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
      sparse: true,
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
    selectedAddressIndex: { type: Number, default: null },
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

/**
 * Mongoose model for User documents.
 */
export const usersModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", usersSchema);


/**
 * Repository class for interacting with the User collection.
 */
class Users {
  /**
   * Fetches all users.
   * @returns A promise that resolves to an array of UserDoc.
   */
  async showAll(): Promise<UserDoc[]> {
    try {
      return await usersModel.find().select("-password").lean<UserDoc[]>();
    } catch {
      throw new CustomError("Failed to fetch users", 500, "users.showAll");
    }
  }

  /**
   * Fetches users with pagination.
   * Admin user listing.
   * @param options Pagination options.
   * @returns A paginated result containing users.
   */
  async showAllPaginated(
    options: { page?: number; limit?: number } = {},
  ): Promise<PaginatedResult<UserDoc>> {
    const { page = 1, limit = 20 } = options;
    try {
      const [items, total] = await Promise.all([
        usersModel
          .find()
          .select("-password")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean<UserDoc[]>(),
        usersModel.countDocuments(),
      ]);
      return { items, total };
    } catch {
      throw new CustomError(
        "Failed to fetch users",
        500,
        "users.showAllPaginated",
      );
    }
  }

  /**
   * Fetches a single user matching the query.
   * @param query MongoDB query object.
   * @returns The user document or null if not found.
   */
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

  /**
   * Creates a new user.
   * @param obj The user data.
   * @returns The created user document (without password).
   */
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

  /**
   * Deletes a user by ID.
   * @param id The ID of the user to delete.
   * @returns The deleted user document or null if not found.
   */
  async delete(id: string): Promise<UserDoc | null> {
    if (!isValidObjectId(id)) return null;
    try {
      return await usersModel
        .findByIdAndDelete(id)
        .select("-password")
        .lean<UserDoc | null>();
    } catch {
      throw new CustomError("Failed to delete user", 500, "users.delete");
    }
  }

  /**
   * Updates a user by ID.
   * @param id The ID of the user to update.
   * @param data The data to update.
   * @returns The updated user document or null if not found.
   */
  async update(
    id: string,
    data: Partial<IUser> & { _id?: unknown },
  ): Promise<UserDoc | null> {
    if (!isValidObjectId(id)) return null;
    try {
      const updateData = omitId(data);
      return await usersModel
        .findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true },
        )
        .select("-password")
        .lean<UserDoc | null>();
    } catch {
      throw new CustomError("Failed to update user", 500, "users.update");
    }
  }
}

export default Users;
