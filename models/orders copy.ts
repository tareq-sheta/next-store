// // import { callDB } from "../DB_connect";
// import mongoose from "mongoose";
// import orderItemSchema from "./orderItem.js";
// import { CustomError } from "../utils/ErrorHandler.js";

// let ordersSchema = mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Users", // Conventionally, collection names are lowercase
//       required: true,
//     },
//     products: {
//       type: [orderItemSchema], // Defines an array of objects
//       required: true,
//       validate: {
//         validator: function (arr) {
//           return arr && arr.length >= 1; // Custom validator to check array length
//         },
//         message: "a product list must contain at least one product.",
//       },
//     },
//     status: {
//       type: String,
//       enum: ["pending", "shipped", "delivered", "cancelled"],
//       default: "pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // /*
// //  *
// //  *
// //  *
// //  */
// // ----------------------------------------
// // ----------------------------------------
// // ----------------------------------------
// // const index =;
// let ordersModel = mongoose.model("Orders", ordersSchema);
// class Orders {
//   async showAll(query) {
//     try {
//       const Response = await ordersModel.find(query);
//       return Response;
//     } catch (error) {
//       throw new CustomError(
//         `index methode in orders controller didnt work2 ${Object.keys(error)}`,
//         404,
//         "in orders showAll model"
//       );
//     }
//   }

//   async populateMultiple(searchObj, populatePaths) {
//     try {
//       const populatedOrder = await ordersModel
//         .findOne(searchObj)
//         .populate(populatePaths);
//       return populatedOrder;
//     } catch (err) {
//       throw new CustomError(
//         `failed to populate fields`,
//         500,
//         "in order populateMultiple model"
//       );
//     }
//   }
//   async showOne(query) {
//     try {
//       //console.log(query, "inside showOne model");
//       const [Response] = await ordersModel.find(query);

//       if (!Response) {
//         return null;
//       }
//       return Response;
//     } catch (err) {
//       throw new CustomError(
//         `Could not find the order with query = ${query}. Error: ${err}`,
//         404,
//         "in order showOne model"
//       );
//     }
//   }
//   //-----------------------
//   async create(obj) {
//     try {
//       // const existingOrder = await ordersModel.findOne({ user: obj.user });
//       // if (existingOrder) {
//       //   return null;
//       // }
//       const newOrder = await ordersModel.create(obj);
//       return newOrder;
//     } catch (err) {
//       // This catches Mongoose validation errors
//       if (err.name === "ValidationError") {
//         throw new CustomError(
//           err.message,
//           400,
//           "Validation failed in create orders model."
//         );
//       }
//       // For other errors, such as a duplicate key error
//       throw new CustomError(
//         "Failed to create new order.",
//         500,
//         "in create orders model"
//       );
//     }
//   }
//   //-----------------------
//   // async create(obj) {
//   //   try {
//   //     //console.log(obj, "inside create model");
//   //     const Response = await cartModel.create({
//   //       _userId: obj._userId,
//   //       products: obj.products,
//   //     });
//   //     //console.log(Response, "afterResponse in create model");
//   //     return Response;
//   //   } catch (err) {
//   //     throw new CustomError(
//   //       "failed to create new cart",
//   //       400,
//   //       "in cart create model"
//   //     );
//   //   }
//   // }
//   //-----------------------

//   // async create({ _userId, products }) {
//   //   try {
//   //     // Find the cart for the user and update it.
//   //     // upsert: true will create a new document if one doesn't exist.
//   //     const updatedCart = await cartModel.findOneAndUpdate(
//   //       { _userId: _userId },
//   //       { $set: { products: products } },
//   //       {
//   //         new: true, // Return the updated document
//   //         upsert: true, // Create a new document if needed
//   //         runValidators: true, // Ensure schema validation is run
//   //       }
//   //     );

//   //     return updatedCart;
//   //   } catch (error) {
//   //     // Pass the actual Mongoose validation error to the controller
//   //     if (error.name === "ValidationError") {
//   //       throw new CustomError(
//   //         error.message,
//   //         400,
//   //         "Validation failed in cart model."
//   //       );
//   //     }
//   //     throw new CustomError(
//   //       "Failed to update or create cart.",
//   //       500,
//   //       "in cart model"
//   //     );
//   //   }
//   // }
//   //-------------------------
//   async delete(id) {
//     try {
//       //console.log(id, "inside delete model");
//       const Response = await ordersModel.findByIdAndDelete({ _id: id });
//       //console.log(Response, "afterResponse in delete model");
//       return Response;
//     } catch (err) {
//       throw new CustomError(
//         "failed to delete order",
//         400,
//         "in orders delete model"
//       );
//     }
//   }

//   async update(obj) {
//     try {
//       const Response = await ordersModel.findOneAndUpdate(
//         { _id: obj._id },
//         obj,
//         {
//           new: true,
//           runValidators: true,
//         }
//       );
//       //console.log(Response, "afterResponse in update model");
//       return Response;
//     } catch (err) {
//       throw new CustomError(
//         "failed to update order",
//         400,
//         "in orders update model"
//       );
//     }
//   }
// }

// export default Orders;

// // export let ordersModel = mongoose.model("Orders", ordersSchema);
// // export let ordersModel = mongoose.model("Orders", ordersSchema);
