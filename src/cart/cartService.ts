import asyncHandler from "express-async-handler";
import { customReq } from "../auth/dto/customReq";
import { NextFunction, Response } from "express";
import { Cart } from "../models/Cart";
import { CartItemDto } from "./dto/cartItemDto";
import { CreateApiErr } from "../errors/customErr";
import { isValidObjectId } from "mongoose";
import { Product } from "../models/Product";

// /api/v1/cart    |   GET    |   private
export const getUserCart = asyncHandler(
  async (req: customReq, res: Response) => {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(cart?.products);
  }
);

// /api/v1/cart/    |   POST    |   private
export const addItem = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { productId, count } = req.body as CartItemDto;
    const userCart = await Cart.findOne({ user: req.user._id });

    if (productId && count && isValidObjectId(productId)) {
      const product = await Product.findById(productId);

      if (product && product.stock) {
        const check: boolean = userCart?.products.find(
          (el: any) => String(el.productId) === productId
        );

        if (!check) {
          const add = await Cart.updateOne(
            { user: req.user._id },
            { $push: { products: { productId, count } } }
          );
          res.json(add);
        } else next(CreateApiErr("this item already in cart"));
      } else next(CreateApiErr("product out of stock"));
    } else next(CreateApiErr("not valid data", 400));
  }
);

// /api/v1/cart/:id    |   PUT    |   private
export const updateItem = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { count } = req.body;
    if (isValidObjectId(id)) {
      const product = await Product.findById(id);
      if (product && product.stock) {
        const update = await Cart.updateOne(
          {
            user: req.user._id,
            "products.productId": id,
          },
          {
            $set: { "products.$.count": count },
          }
        );
        res.json(update);
      } else next(CreateApiErr("product out of stock"));
    } else next(CreateApiErr("not valid ID"));
  }
);

// /api/v1/cart/:id    |   DELETE    |   private
export const removeAllItem = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const resetCart = await Cart.updateOne(
      { user: req.user._id },
      { $set: { products: [] } }
    );
    res.json(resetCart);
  }
);
