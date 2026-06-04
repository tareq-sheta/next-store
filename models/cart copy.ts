// // import { callDB } from "../DB_connect";
// import mongoose from "mongoose";
// import { cartItemSchema } from "./cartItem.js";
// import { CustomError } from "../utils/ErrorHandler.js";

// let cartSchema = mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Users",
//       unique: true,
//       required: true,
//       message: "A cart must have a user ID.",
//     },
//     products: {
//       type: [cartItemSchema],
//       required: true,
//       validate: {
//         validator: function (arr) {
//           console.log(arr, "arr");
//           return arr.length > 0;
//         },
//         message: "A cart must have at least one product.",
//       },
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
// let cartModel = mongoose.model("Cart", cartSchema);
// class Cart {
//   async showAll() {
//     try {
//       const Response = await cartModel.find();
//       return Response;
//     } catch (error) {
//       throw new CustomError(
//         `index methode in sellers controller didnt work2 ${Object.keys(error)}`,
//         404,
//         "in sellers showAll model"
//       );
//     }
//   }

//   async populateMultiple(searchObj, populatePaths) {
//     try {
//       const populatedCart = await cartModel
//         .findOne(searchObj)
//         .populate(populatePaths);
//       return populatedCart;
//     } catch (err) {
//       throw new CustomError(
//         `failed to populate fields`,
//         500,
//         "in cart populateMultiple model"
//       );
//     }
//   }
//   //-----------------------
//   async showOne(query) {
//     try {
//       //console.log(query, "inside showOne model");
//       // const [Response] = await usersModel.find(query);
//       const [Response] = await cartModel.find(query);

//       if (!Response) {
//         return null;
//       }
//       return Response;
//     } catch (err) {
//       throw new CustomError(
//         `Could not find the cart with query = ${query}. Error: ${err}`,
//         404,
//         "in cart showOne model"
//       );
//     }
//   }
//   //-----------------------
//   async create(obj) {
//     try {
//       const existingCart = await cartModel.findOne({ user: obj.user });
//       console.log(existingCart, "existingCart");
//       if (existingCart) {
//         return null;
//       }
//       const newCart = await cartModel.create(obj);
//       return newCart;
//     } catch (err) {
//       // This catches Mongoose validation errors
//       if (err.name === "ValidationError") {
//         throw new CustomError(
//           err.message,
//           400,
//           "Validation failed in cart model."
//         );
//       }
//       // For other errors, such as a duplicate key error
//       throw new CustomError("Failed to create new cart.", 500, "in cart model");
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
//       const Response = await cartModel.findByIdAndDelete({ _id: id });
//       //console.log(Response, "afterResponse in delete model");
//       return Response;
//     } catch (err) {
//       throw new CustomError(
//         "failed to delete cart",
//         400,
//         "in cart delete model"
//       );
//     }
//   }

//   async update(obj) {
//     try {
//       const Response = await cartModel.findOneAndUpdate({ _id: obj._id }, obj, {
//         new: true,
//         runValidators: true,
//       });
//       //console.log(Response, "afterResponse in update model");
//       return Response;
//     } catch (err) {
//       throw new CustomError(
//         "failed to update cart",
//         400,
//         "in cart update model"
//       );
//     }
//   }
// }

// export default Cart;
