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
    res.json("all products");
  }
);

// /api/v1/products    |   POST    |   private
export const addProduct = asyncHandler(
  async (req: customReq, res: Response) => {
    const { name, discription, imgs } = req.body as productDto;
    const product = await Product.create({
      vendore: req.user._id,
      name,
      discription,
      imgs,
    });
    res.json(product);
  }
);

export const updateProduct = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, discription, imgs } = req.body as productDto;

    if (isValidObjectId(id)) {
      const product = await Product.findById(id);

      if (product && String(product.vendore) === String(req.user._id)) {
        const update = await Product.updateOne(
          { _id: id },
          { $set: { name, discription }, $push: { imgs } }
        );

        res.json(update);
      } else next(CreateApiErr("Product Not Found ", 404));
    } else next(CreateApiErr("not valid id ", 400));
  }
);

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
