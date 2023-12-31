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
    console.log(req.user._id);
    res.json(cart?.products);
  }
);

// /api/v1/cart/    |   POST    |   private
export const addItem = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { productId, count } = req.body as CartItemDto;
    const userCart = await Cart.findOne({ user: req.user._id });

    if (!userCart) {
      await Cart.create({ user: req.user._id });
    }

    if (productId && count && isValidObjectId(productId)) {
      const product = await Product.findById(productId);

      // check product found
      if (product && product.stock) {
        const check: boolean = userCart?.products.find(
          (el: any) => String(el.productId) === productId
        );

        if (!check) {
          const { name, img, price } = product;
          const add = await Cart.updateOne(
            { user: req.user._id },
            {
              $push: {
                products: { productId: product._id, count, name, img, price },
              },
            }
          );
          res.json(add);
        } else {
          // if item in cart update count +1
          // catch item
          const currnt = userCart?.products.filter(
            (el: any) => String(el.productId) === productId
          );
          const update = await Cart.updateOne(
            {
              user: req.user._id,
              "products.productId": productId,
            },
            { $set: { "products.$.count": currnt[0].count + 1 } }
          );
          res.json(update);
        }
      } else next(CreateApiErr("product out of stock"));
    } else next(CreateApiErr("not valid data", 400));
  }
);

// /api/v1/cart/:id    |   PUT    |   private
export const updateItem = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { count } = req.body;
    if (isValidObjectId(id) && count >= 1) {
      const update = await Cart.updateOne(
        {
          user: req.user._id,
          "products._id": id,
        },
        { $set: { "products.$.count": count } }
      );
      if (update.modifiedCount) {
        res.json(update);
      } else next(CreateApiErr("cart item not found", 404));
    } else next(CreateApiErr("not valid Data", 400));
  }
);

// /api/v1/cart/:id    |   DELETE    |   private
export const removeCartItem = asyncHandler(
  async (req: customReq, res: Response) => {
    const { id } = req.params;
    const removeItem = await Cart.updateOne(
      {
        user: req.user._id,
      },
      {
        $pull: { products: { _id: id } },
      }
    );
    res.json(removeItem);
  }
);

// /api/v1/cart/   |   DELETE    |   private
export const removeAllItem = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const resetCart = await Cart.updateOne(
      { user: req.user._id },
      { $set: { products: [] } }
    );
    res.json(resetCart);
  }
);
