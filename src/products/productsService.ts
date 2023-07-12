import asyncHandler from "express-async-handler";
import { customReq } from "../auth/dto/customReq";
import { NextFunction, Response } from "express";
import { CreateApiErr } from "../errors/customErr";

export const getAllProducts = asyncHandler(
  async (req: customReq, res: Response) => {
    res.json("all products");
  }
);

export const addProduct = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { name, discrition, imgs } = req.body;
    if (name && discrition && imgs) {
      res.json(req.body);
    } else next(CreateApiErr("enter values", 400));
  }
);
