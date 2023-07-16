import asyncHandler from "express-async-handler";
import { customReq } from "../auth/dto/customReq";
import { NextFunction, Response } from "express";
import { CreateApiErr } from "../errors/customErr";

export default asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    if (req.user.rule === "vendore" || req.user.rule === "admin") {
      next();
    } else next(CreateApiErr("don't have an access"));
  }
);
