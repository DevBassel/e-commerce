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
      // check user login
      if (!cookie) next(CreateApiErr("Unauthorized", 401));

      // verify token
      const { id } = jwt.verify(
        cookie,
        String(process.env.JWT_KEY)
      ) as jwtPayload;

      // get user
      const user = await User.findById(id).select("-password");

      if (!user) next(CreateApiErr("Not Found", 404));

      if (!user?.verify) next(CreateApiErr("Your Email Not Verifyed ", 401));

      // all done
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
);
