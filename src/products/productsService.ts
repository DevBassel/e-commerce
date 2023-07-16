import asyncHandler from "express-async-handler";
import { customReq } from "../auth/dto/customReq";
import { NextFunction, Response } from "express";
import { CreateApiErr } from "../errors/customErr";
import { productDto } from "./dto/productDto";
import { Product } from "../models/Product";
import { isValidObjectId } from "mongoose";
const perPage: number = 20;

// /api/v1/products    |   GET    |   private
export const searchProducts = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { search, page } = req.query;

    if (search && !isNaN(Number(page))) {
      const products = await Product.find({
        name: { $regex: new RegExp(String(search), "i") },
      })
        .sort()
        .skip(perPage * (Number(page) - 1))
        .limit(perPage);

      res.json(products);
    } else next(CreateApiErr("not valid query", 400));
  }
);

// /api/v1/products/:id    |   GET    |   private
export const getSingleProduct = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (isValidObjectId(id)) {
      const product = await Product.findById(id);
      console.log(product);
      if (product) {
        res.json(product);
      } else next(CreateApiErr("product not found", 404));
    } else next(CreateApiErr("not valid id", 400));
  }
);

// /api/v1/products    |   POST    |   private
export const addProduct = asyncHandler(
  async (req: customReq, res: Response) => {
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
