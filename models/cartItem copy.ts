// // import { callDB } from "../DB_connect";
// import mongoose from "mongoose";

// // export type Order_Type = {
// //   id: number;
// //   /* prdctsID_in_order: number; */
// //   quantity_in_order: number;
// //   user_id: number;
// //   status_of_order: string;
// // };
// export let cartItemSchema = mongoose.Schema({
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
//       message: "A cart must have at least one product.",
//     },
//   },
// });
// // /*
// //  *
// //  *
// //  *
// //  */
// // ----------------------------------------

// export default cartItemSchema;
