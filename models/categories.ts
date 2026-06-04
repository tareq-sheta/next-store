import mongoose, { Document, Schema, Model, Types } from "mongoose";
import slugify from "slugify";
import { CustomError } from "@/utils/ErrorHandler";

export interface ICategory extends Document {
  name: string;
  slug: string;
  parentId?: Types.ObjectId | null;
  depth: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CategoryDoc = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  parentId?: Types.ObjectId | null;
  depth: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export const categoriesSchema: Schema<ICategory> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A category must have a name."],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    depth: {
      type: Number,
      default: 0,
      max: [2, "Category tree can only be 3 levels deep"],
    },
  },
  {
    timestamps: true,
  },
);

categoriesSchema.pre("save", async function () {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
});

export const categoriesModel: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categoriesSchema);

function omitId<T extends { _id?: unknown }>(data: T): Omit<T, "_id"> {
  const { _id: _omit, ...rest } = data;
  return rest;
}

class Categories {
  async showAll(): Promise<CategoryDoc[]> {
    try {
      return await categoriesModel
        .find()
        .select("name slug parentId depth createdAt updatedAt")
        .lean<CategoryDoc[]>();
    } catch {
      throw new CustomError(
        "Failed to fetch categories",
        500,
        "categories.showAll",
      );
    }
  }

  async showOne(query: string): Promise<CategoryDoc | null> {
    try {
      const isId = mongoose.Types.ObjectId.isValid(query);
      const filter = isId ? { _id: query } : { slug: query.toLowerCase() };

      return await categoriesModel.findOne(filter).lean<CategoryDoc | null>();
    } catch {
      throw new CustomError(
        `DB error looking up category: ${query}`,
        500,
        "categories.showOne",
      );
    }
  }

  async create(obj: Partial<ICategory>): Promise<CategoryDoc> {
    try {
      if (obj.parentId) {
        const parent = await categoriesModel
          .findById(obj.parentId)
          .lean<CategoryDoc | null>();

        if (!parent) {
          throw new CustomError(
            "Parent category not found",
            404,
            "categories.create",
          );
        }
        if (parent.depth >= 2) {
          throw new CustomError(
            "Max category depth of 3 reached",
            400,
            "categories.create",
          );
        }

        const category = await categoriesModel.create({
          ...obj,
          depth: parent.depth + 1,
        });
        return category.toObject();
      }

      const category = await categoriesModel.create({
        ...obj,
        depth: obj.depth ?? 0,
      });
      return category.toObject();
    } catch (err: unknown) {
      if (err instanceof CustomError) throw err;
      throw new CustomError(
        "Failed to create category",
        500,
        "categories.create",
      );
    }
  }

  async delete(id: string): Promise<CategoryDoc | null> {
    try {
      return await categoriesModel
        .findByIdAndDelete(id)
        .lean<CategoryDoc | null>();
    } catch {
      throw new CustomError(
        "Failed to delete category",
        500,
        "categories.delete",
      );
    }
  }

  async update(
    id: string,
    data: Partial<ICategory> & { _id?: unknown },
  ): Promise<CategoryDoc | null> {
    try {
      const updateData = omitId(data);
      return await categoriesModel
        .findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true },
        )
        .lean<CategoryDoc | null>();
    } catch {
      throw new CustomError(
        "Failed to update category",
        500,
        "categories.update",
      );
    }
  }
}

export default Categories;
