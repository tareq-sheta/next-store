import mongoose, { Document, Schema, Model, Types } from "mongoose";
import slugify from "slugify";
import { CustomError } from "@/utils/ErrorHandler";
import { omitId } from "@/utils/mongoose";

/**
 * Mongoose document interface for a Category.
 */
export interface ICategory extends Document {
  /** The display name of the category */
  name: string;
  /** URL-friendly slug */
  slug: string;
  /** ID of the parent category, if this is a subcategory */
  parentId?: Types.ObjectId | null;
  /** The depth level of the category in the hierarchy (0-2) */
  depth: number;
  /** Creation timestamp */
  createdAt?: Date;
  /** Last update timestamp */
  updatedAt?: Date;
}

/**
 * Plain object representation of a Category, without Mongoose Document properties.
 */
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

/**
 * Mongoose model for Category documents.
 */
export const categoriesModel: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categoriesSchema);


/**
 * Repository class for interacting with the Category collection.
 */
class Categories {
  /**
   * Fetches all categories.
   * @returns A promise resolving to an array of CategoryDoc.
   */
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

  /**
   * Fetches a single category by its ID or slug.
   * @param query The category ID or slug string.
   * @returns The category document or null if not found.
   */
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

  /**
   * Creates a new category.
   * Validates the depth of the category tree (max 3 levels).
   * @param obj The category data.
   * @returns The created category document.
   */
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

  /**
   * Deletes a category by ID.
   * @param id The ID of the category to delete.
   * @returns The deleted category document or null if not found.
   */
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

  /**
   * Updates a category by ID.
   * Validates depth and prevents circular dependencies (a category cannot be its own parent).
   * @param id The ID of the category to update.
   * @param data The data to update.
   * @returns The updated category document or null if not found.
   */
  async update(
    id: string,
    data: Partial<ICategory> & { _id?: unknown },
  ): Promise<CategoryDoc | null> {
    try {
      const updateData = omitId(data);
      if (updateData.parentId !== undefined) {
        if (updateData.parentId?.toString() === id) {
          throw new CustomError(
            "A category cannot be its own parent",
            400,
            "categories.update",
          );
        }
        if (updateData.parentId) {
          const parent = await categoriesModel
            .findById(updateData.parentId)
            .lean<CategoryDoc | null>();
          if (!parent)
            throw new CustomError(
              "Parent category not found",
              404,
              "categories.update",
            );
          if (parent.depth >= 2)
            throw new CustomError(
              "Max category depth of 3 reached",
              400,
              "categories.update",
            );
          (updateData as Partial<ICategory>).depth = parent.depth + 1;
        } else {
          (updateData as Partial<ICategory>).depth = 0;
        }
      }
      return await categoriesModel
        .findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true },
        )
        .lean<CategoryDoc | null>();
    } catch (err) {
      if (err instanceof CustomError) throw err;
      throw new CustomError(
        "Failed to update category",
        500,
        "categories.update",
      );
    }
  }
}

export default Categories;
