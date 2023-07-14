import { NextFunction, Request, Response } from "express";
import { LoginDto } from "./dto/loginDto";
import asyncHandler from "express-async-handler";
import { RegisterDto } from "./dto/registerDto";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CreateApiErr } from "../errors/customErr";
import mongoose from "mongoose";
import { Cart } from "../models/Cart";

// /api/v1/register    |   POST    |   public
const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, rule } = req.body as RegisterDto;
    if (rule === "vendore" || rule === "user") {
      const user = await User.create({ name, email, password, rule });
      await Cart.create({ user: user._id });
      res.cookie("auth", genToken(user._id), {
        // cookie is valid 30 day
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      });
      res.json({ token: genToken(user._id) });
    } else next(CreateApiErr("enter valid data", 400));
  }
);

// /api/v1/login    |   POST    |   public
const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as LoginDto;

    if (email && password) {
      const user = await User.findOne({ email });

      if (user) {
        if (await bcrypt.compare(password, String(user.password))) {
          res.cookie("auth", genToken(user._id), {
            // cookie is valid 30 days
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
          });
          res.json({
            success: true,
            user: { name: user.name, email: user.email },
          });
        } else next(CreateApiErr("Email or password is wrong", 403));
      } else next(CreateApiErr("User Not Found", 404));
    } else next(CreateApiErr("not valid data", 400));
  }
);

const genToken = (id: mongoose.Types.ObjectId) => {
  return jwt.sign({ id }, String(process.env.JWT_KEY));
};

export { login, register };
