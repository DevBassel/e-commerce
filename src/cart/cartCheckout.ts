import { NextFunction, Response } from "express";
import { customReq } from "../auth/dto/customReq";
import asyncHandler from "express-async-handler";
import { Cart } from "../models/Cart";
import Stripe from "stripe";

const sk = process.env.SK;

const stripe = new Stripe(String(sk), {
  apiVersion: "2022-11-15", // Use the appropriate API version
});

export const checkOut = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const cart = await Cart.findOne({ user: req.user._id });
    const images: string[] = [];
    let total: number = 0;
    let productes: string = "";

    cart?.products.forEach((item: any) => {
      let num: number = 0;
      num = item.price * item.count;
      total += num / 30;
      productes += `${item.name} - `;
      images.push(item.img);
    });
    total *= 1000;
    console.log(images, total);
    // paymeny getway logic
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productes,
              images,
            },
            unit_amount: Number(total.toFixed(0)),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json(session);
  }
);
