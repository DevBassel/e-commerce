import mongoose, { Schema } from "mongoose";
import { productSchema } from "./Product";
import { extendSchema } from "../help";

const cartProduct: Schema = extendSchema(
  {
    productId: mongoose.Types.ObjectId,
    count: { type: Number, required: true, default: 1 },
  },
  productSchema,
  ["vendore", "discription", "stock"]
);

const cartSchema: Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: [true, "add ref user"],
      ref: "User",
    },
    products: {
      type: [cartProduct],
      required: [true, "add product data"],
      default: [],
    },
  },
  { timestamps: true }
);

export const Cart = mongoose.model("cart", cartSchema);
