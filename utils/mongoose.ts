// utils/mongoose.ts
import mongoose from "mongoose";

export function omitId<T extends { _id?: unknown }>(data: T): Omit<T, "_id"> {
  const { _id: _omit, ...rest } = data;
  return rest;
}

export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}
