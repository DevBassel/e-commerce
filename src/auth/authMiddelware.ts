import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { jwtPayload } from "./dto/jwtDto";
import { customReq } from "./dto/customReq";
import { CreateApiErr } from "../errors/customErr";

export default asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const cookie: string = req.cookies.auth;
    try {
      if (cookie) {
        const { id } = jwt.verify(
          cookie,
          String(process.env.JWT_KEY)
        ) as jwtPayload;
        const user = await User.findById(id).select("-password");
        if (user) {
          req.user = user;
          next();
        } else throw new Error("Not found user");
      } else {
        next(CreateApiErr("Unauthorized", 401));
      }
    } catch (error) {
      next(error);
    }
  }
);
