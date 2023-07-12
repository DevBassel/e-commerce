import { NextFunction, Response } from "express";
import asyncHandler from "express-async-handler";
import { customReq } from "../auth/dto/customReq";
import User from "../models/User";
import { userDto } from "./dto/userDto";
import { CreateApiErr } from "../errors/customErr";
import { isValidObjectId } from "mongoose";

// /api/v1/profile    |   GET    |   private
export const profile = asyncHandler(async (req: customReq, res: Response) => {
  res.json(req.user);
});

// /api/v1/allUsers    |   GET    |   private
export const getAllUsers = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    if (req.user.rule === "admin") {
      const users: userDto | unknown = await User.find({
        _id: { $ne: req.user._id },
      }).select("-password -__v");

      res.json(users);
    } else {
      next(CreateApiErr("don't have access", 401));
    }
  }
);

// /api/v1/allUsers/:id    |   GET    |   private
export const getUserById = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (isValidObjectId(id)) {
      const user: userDto | unknown = await User.findById(id).select(
        "-password"
      );
      if (user) {
        res.json(user);
      } else next(CreateApiErr("User Not Found ", 404));
    } else next(CreateApiErr("not valid id ", 400));
  }
);

// /api/v1/users/:id    |   DELETE    |   private
export const deleteUser = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (isValidObjectId(id)) {
      if (req.user.rule === "admin") {
        const user = await User.findByIdAndDelete(id);
        if (user) res.json(user);
        else next(CreateApiErr("Not Found", 404));
      } else next(CreateApiErr("don't have an access", 401));
    } else next(CreateApiErr("Not valid id", 400));
  }
);