// // import { callDB } from "../DB_connect";
// import mongoose from "mongoose";
// import { CustomError } from "../utils/ErrorHandler.js";
// import { hash, genSalt } from "bcrypt";

// // export type Order_Type = {
// //   id: number;
// //   /* prdctsID_in_order: number; */
// //   quantity_in_order: number;
// //   user_id: number;
// //   status_of_order: string;
// // };
// let usersSchema = mongoose.Schema(
//   {
//     userName: {
//       type: String,
//       unique: true,
//       required: true,
//       minLength: 5,
//       message: "A user must have at least 5 characters.",
//     },
//     password: {
//       type: String,
//       required: true,
//       message: "A user must have at least one password.",
//     },
//     role: {
//       type: String,
//       enum: ["user", "seller", "admin"],
//       default: "user",
//       message: "A user must have avalid role.[user,seller,admin]",
//     },
//   },
//   {
//     timestamps: true,
//   },
// );
// // /*
// //  *
// //  *
// //  *
// //  */
// // ----------------------------------------
// // ----------------------------------------
// // ----------------------------------------

// usersSchema.pre("save", async function (next) {
//   // //console.log(this, "_____save users_____1");
//   const salt = await genSalt(10);
//   let hashedPassword = hash(this.password, salt);
//   this.password = await hashedPassword;
//   //console.log(this, "after pre save");
//   next();
// });
// usersSchema.pre("findOneAndUpdate", async function (next) {
//   // //console.log("_____save users_____2");
//   // //console.log(this);
//   const update = this.getUpdate();
//   if (update.password) {
//     const salt = await genSalt(10);
//     update.password = await hash(update.password, salt);
//   }
//   //console.log(update, "after pre findOneAndUpdate");
//   next();
// });
// let usersModel = mongoose.model("Users", usersSchema);
// // export let usersModel = mongoose.model("Users", usersSchema);
// class Users {
//   async showAll() {
//     try {
//       const Response = await usersModel.find();
//       return Response;
//     } catch (error) {
//       throw new CustomError(
//         `index methode in order controller didnt work2 ${Object.keys(error)}`,
//         404,
//         "in users showAll model",
//       );
//     }
//   }

//   async showOne(query) {
//     try {
//       //console.log(query, "inside showOne model");
//       // const [Response] = await usersModel.find(query);
//       const [Response] = await usersModel.find(query);

//       //console.log(Response, "afterResponse in showOne model");
//       if (!Response) {
//         return null;
//       }
//       return Response;
//     } catch (err) {
//       throw new CustomError(
//         `Could not find the Order with query = ${query}. Error: ${err}`,
//         404,
//         "in users showOne model",
//       );
//     }
//   }

//   async create(obj) {
//     try {
//       const Response = await usersModel.create(obj);
//       //console.log(Response, "afterResponse in create model");
//       return Response;
//     } catch (err) {
//       throw new CustomError(
//         "failed to create new user",
//         400,
//         "in users create model",
//       );
//     }
//   }

//   async delete(id) {
//     try {
//       //console.log(id, "inside delete model");
//       const Response = await usersModel.findByIdAndDelete({ _id: id });
//       //console.log(Response, "afterResponse in delete model");
//       return Response;
//     } catch (err) {
//       throw new CustomError(
//         "failed to delete user",
//         400,
//         "in users delete model",
//       );
//     }
//   }

//   async update(obj) {
//     try {
//       const Response = await usersModel.findOneAndUpdate(
//         { _id: obj._id },
//         obj,
//         {
//           new: true,
//           runValidators: true,
//         },
//       );
//       //console.log(Response, "afterResponse in update model");
//       return Response;
//     } catch (err) {
//       throw new CustomError(
//         "failed to update user",
//         400,
//         "in users update model",
//       );
//     }
//   }
// }

// export default Users;
// //-------------------
// //-------------------
// //-------------------
// // import mongoose, { Document, Model, Schema } from "mongoose";
// // import { CustomError } from "@/utils/ErrorHandler.js";
// // import { hash, genSalt } from "bcryptjs";

// // // ----------------------------------------
// // // Types & Interfaces
// // // ----------------------------------------

// // export type UserRole = "user" | "seller" | "admin";

// // export interface IUser extends Document {
// //   userName: string;
// //   password: string;
// //   role: UserRole;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // export interface IUserQuery {
// //   _id?: string;
// //   userName?: string;
// //   role?: UserRole;
// //   [key: string]: unknown;
// // }

// // export interface IUserUpdate extends Partial<IUser> {
// //   _id: string;
// // }

// // // ----------------------------------------
// // // Schema
// // // ----------------------------------------

// // const usersSchema = new Schema<IUser>(
// //   {
// //     userName: {
// //       type: String,
// //       unique: true,
// //       required: true,
// //       minlength: [5, "A user must have at least 5 characters."],
// //     },
// //     password: {
// //       type: String,
// //       required: [true, "A user must have at least one password."],
// //     },
// //     role: {
// //       type: String,
// //       enum: {
// //         values: ["user", "seller", "admin"] as UserRole[],
// //         message: "A user must have a valid role. [user, seller, admin]",
// //       },
// //       default: "user",
// //     },
// //   },
// //   {
// //     timestamps: true,
// //   },
// // );

// // // ----------------------------------------
// // // Middleware
// // // ----------------------------------------

// // usersSchema.pre("save", async function (next) {
// //   const salt = await genSalt(10);
// //   this.password = await hash(this.password, salt);
// //   next();
// // });

// // usersSchema.pre("findOneAndUpdate", async function (next) {
// //   const update = this.getUpdate() as { password?: string } | null;
// //   if (update?.password) {
// //     const salt = await genSalt(10);
// //     update.password = await hash(update.password, salt);
// //   }
// //   next();
// // });

// // // ----------------------------------------
// // // Model
// // // ----------------------------------------

// // const usersModel: Model<IUser> = mongoose.model<IUser>("Users", usersSchema);

// // // ----------------------------------------
// // // Class
// // // ----------------------------------------

// // class Users {
// //   async showAll(): Promise<IUser[]> {
// //     try {
// //       return await usersModel.find();
// //     } catch (error) {
// //       throw new CustomError(
// //         `index method in users controller didn't work: ${Object.keys(error as object)}`,
// //         404,
// //         "in users showAll model",
// //       );
// //     }
// //   }

// //   async showOne(query: IUserQuery): Promise<IUser | null> {
// //     try {
// //       const [response] = await usersModel.find(query);
// //       return response ?? null;
// //     } catch (err) {
// //       throw new CustomError(
// //         `Could not find the User with query = ${JSON.stringify(query)}. Error: ${err}`,
// //         404,
// //         "in users showOne model",
// //       );
// //     }
// //   }

// //   async create(obj: Partial<IUser>): Promise<IUser> {
// //     try {
// //       return await usersModel.create(obj);
// //     } catch (err) {
// //       throw new CustomError(
// //         "failed to create new user",
// //         400,
// //         "in users create model",
// //       );
// //     }
// //   }

// //   async delete(id: string): Promise<IUser | null> {
// //     try {
// //       return await usersModel.findByIdAndDelete({ _id: id });
// //     } catch (err) {
// //       throw new CustomError(
// //         "failed to delete user",
// //         400,
// //         "in users delete model",
// //       );
// //     }
// //   }

// //   async update(obj: IUserUpdate): Promise<IUser | null> {
// //     try {
// //       return await usersModel.findOneAndUpdate({ _id: obj._id }, obj, {
// //         new: true,
// //         runValidators: true,
// //       });
// //     } catch (err) {
// //       throw new CustomError(
// //         "failed to update user",
// //         400,
// //         "in users update model",
// //       );
// //     }
// //   }
// // }

// // export default Users;
