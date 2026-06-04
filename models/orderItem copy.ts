// // import { callDB } from "../DB_connect";
// import mongoose from "mongoose";

// // export type Order_Type = {
// //   id: number;
// //   /* prdctsID_in_order: number; */
// //   quantity_in_order: number;
// //   user_id: number;
// //   status_of_order: string;
// // };
// export let orderItemSchema = mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Products",
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     validate: {
//       validator: function (num) {
//         return num > 0;
//       },
//       message: "An order must have at least one product",
//     },
//   },
//   status: {
//     type: String,
//     enum: ["pending", "shipped", "delivered", "cancelled"],
//     default: "pending",
//   },
//   // totalPrice: {
//   //   type: Number,

//   //   validate: {
//   //     validator: function (num) {
//   //       return num > 0;
//   //     },
//   //     message: "An order must have a price and larger than 0.",
//   //   },
//   // },
// });
// // /*
// //  *
// //  *
// //  *
// //  */
// // ----------------------------------------

// export default orderItemSchema;
