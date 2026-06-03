// // import { callDB } from "../DB_connect";
// import mongoose from "mongoose";
// import { CustomError } from "../utils/ErrorHandler.js";

// // export type Order_Type = {
// //   id: number;
// //   /* prdctsID_in_order: number; */
// //   quantity_in_order: number;
// //   user_id: number;
// //   status_of_order: string;
// // };
// export let productsSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       unique: true,
//       required: true,
//       message: "A product must have a name.",
//     },
//     description: {
//       type: String,
//       required: true,
//       message: "A product must have a description.",
//     },
//     photo: {
//       type: String,
//       required: true,
//       message: "A product must have a photo.",
//     },
//     sellerName: {
//       type: String,
//       ref: "Sellers", // Conventionally, collection names are lowercase
//       required: true,
//       message: "A product must have a seller name.",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
// let productsModel = mongoose.model("Products", productsSchema);
// // /*
// //  *
// //  *
// //  *
// //  */

// class Products {
//   async showAll() {
//     try {
//       const Response = await productsModel.find();
//       return Response;
//     } catch (error) {
//       throw new CustomError(
//         `index methode in order controller didnt work2 ${Object.keys(error)}`,
//         404,
//         "in products showAll model"
//       );
//     }
//   }

//   async showOne(query) {
//     try {
//       console.log(query, "inside showOne model");

//       let Response;
//       if (mongoose.Types.ObjectId.isValid(query)) {
//         Response = await productsModel.findOne({ _id: query });
//       } else {
//         Response = await productsModel.findOne({
//           $or: [{ name: query }, { sellerName: query }],
//         });
//       }

//       //console.log(Response, "afterResponse in showOne model");
//       if (!Response) {
//         return null;
//       }
//       return Response;
//     } catch (err) {
//       throw new CustomError(
//         `Could not find the Product with query = ${query}. Error: ${err}`,
//         404,
//         "in products showOne model"
//       );
//     }
//   }

//   // async showOne(query) {
//   //   try {
//   //     //console.log(query, "inside showOne model");

//   //     const [Response] = await productsModel.find(query);

//   //     //console.log(Response, "afterResponse in showOne model");
//   //     if (!Response) {
//   //       return null;
//   //     }
//   //     return Response;
//   //   } catch (err) {
//   //     throw new CustomError(
//   //       `Could not find the Product with query = ${query}. Error: ${err}`,
//   //       404,
//   //       "in products showOne model"
//   //     );
//   //   }
//   // }

//   async create(obj) {
//     try {
//       const Response = await productsModel.create(obj);
//       //console.log(Response, "afterResponse in create model");
//       return Response;
//     } catch (err) {
//       throw new CustomError(
//         "failed to create new product",
//         400,
//         "in products create model"
//       );
//     }
//   }

//   async delete(id) {
//     try {
//       //console.log(id, "inside delete model");
//       const Response = await productsModel.findByIdAndDelete({ _id: id });
//       //console.log(Response, "afterResponse in delete model");
//       return Response;
//     } catch (err) {
//       throw new CustomError(
//         "failed to delete product",
//         400,
//         "in products delete model"
//       );
//     }
//   }

//   async update(obj) {
//     try {
//       const Response = await productsModel.findOneAndUpdate(
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
//         "failed to update product",
//         400,
//         "in products update model"
//       );
//     }
//   }
// }

// export default Products;

// // ----------------------------------------
// // ----------------------------------------
