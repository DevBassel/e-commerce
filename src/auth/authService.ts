import { NextFunction, Request, Response } from "express";
import { LoginDto } from "./dto/loginDto";
import asyncHandler from "express-async-handler";
import { RegisterDto } from "./dto/registerDto";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CreateApiErr } from "../errors/customErr";

// /api/v1/register    |   POST    |   public
const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, rule } = req.body as RegisterDto;
    if (rule === "vendore" || rule === "user") {
      const user = await User.create({ name, email, password, rule });
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
const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginDto;

  if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email) && password) {
    const user = await User.findOne({ email });

    if (user) {
      if (await bcrypt.compare(password, String(user.password))) {
        res.cookie("auth", genToken(user._id), {
          // cookie is valid 30 day
          maxAge: 1000 * 60 * 60 * 24 * 30,
          httpOnly: true,
        });
        res.json({
          success: true,
          user: { name: user.name, email: user.email },
        });
      } else {
        res.status(403);
        throw new Error("Email or password is wrong");
      }
    } else {
      res.status(404);
      throw new Error("User Not Found");
    }
  } else {
    res.status(400);
    throw new Error("Not Valid Data");
  }
});

const genToken = (id: any) => {
  return jwt.sign({ id }, String(process.env.JWT_KEY));
};

export { login, register };
