import mongoose from "mongoose";
import { commentSchema } from "./Comments";

export const productSchema = new mongoose.Schema(
  {
    vendore: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "add a product name"],
    },
    discription: {
      type: String,
      required: [true, "add a product discription"],
    },
    img: {
      type: String,
      required: [true, "add a product img"],
    },
    category: {
      type: String,
      required: [true, "add category"],
    },
    stock: {
      type: Boolean,
      required: [true, "add stock status"],
    },
    price: {
      type: Number,
      required: [true, "add product price"],
    },
    // comments: {
    //   type: [commentSchema],
    //   default: [],
    // },
  },
  { timestamps: true }
);

export const Product = mongoose.model("product", productSchema);
