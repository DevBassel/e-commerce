import asyncHandler from "express-async-handler";
import { customReq } from "../auth/dto/customReq";
import { NextFunction, Response } from "express";
import { CreateApiErr } from "../errors/customErr";
import { productDto } from "./dto/productDto";
import { Product } from "../models/Product";
import { isValidObjectId } from "mongoose";

// /api/v1/products    |   GET    |   private
export const getAllProducts = asyncHandler(
  async (req: customReq, res: Response) => {
    const products = await Product.find({});
    res.json({ products, total: products.length });
  }
);

// /api/v1/products    |   POST    |   private
export const addProduct = asyncHandler(
  async (req: customReq, res: Response) => {
    const { name, discription, img } = req.body as productDto;
    const product = await Product.create({
      vendore: req.user._id,
      ...(req.body as productDto),
    });
    res.json(product);
  }
);

// /api/v1/products/:id    |   PUT    |   private
export const updateProduct = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (isValidObjectId(id)) {
      const product = await Product.findById(id);
      if (product && String(product.vendore) === String(req.user._id)) {
        const update = await Product.updateOne(
          { _id: id },
          { $set: { ...(req.body as productDto) } }
        );

        res.json(update);
      } else next(CreateApiErr("Product Not Found ", 404));
    } else next(CreateApiErr("not valid id ", 400));
  }
);

// /api/v1/products/:id    |   DELETE    |   private
export const deleteProduct = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (isValidObjectId(id)) {
      const product = await Product.findById(id);

      if (product) {
        if (
          String(product.vendore) === String(req.user._id) ||
          req.user.rule === "admin"
        ) {
          const deleteItem = await Product.deleteOne({ _id: id });
          res.json(deleteItem);
        } else next(CreateApiErr("don't have an access ", 401));
      } else next(CreateApiErr("Product Not Found ", 404));
    } else next(CreateApiErr("not valid id ", 400));
  }
);
