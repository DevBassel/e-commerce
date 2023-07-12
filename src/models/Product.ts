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
    discription: {
      type: String,
      required: [true, "add a product discription"],
    },
    imgs: {
      type: Array,
      required: [true, "add a product imgs"],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("product", productSchema);
