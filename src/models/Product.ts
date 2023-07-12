import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vendore: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "add a product name"],
    },
    discrition: {
      type: String,
      required: [true, "add a product discrition"],
    },
    imgs: {
      type: Array,
      required: [true, "add a product img"],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("product", productSchema);
