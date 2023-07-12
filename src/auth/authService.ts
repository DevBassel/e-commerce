import { Request, Response } from "express";
import { LoginDto } from "./dto/loginDto";
import asyncHandler from "express-async-handler";
import { RegisterDto } from "./dto/registerDto";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// /api/v1/register    |   POST    |   public
const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, rule } = req.body as RegisterDto;
  const user = await User.create({ name, email, password, rule });

  res.cookie("auth", genToken(user._id), {
    // cookie is valid 30 day
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
  });
  res.json({ token: genToken(user._id) });
});

// /api/v1/login    |   POST    |   public
const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginDto;

  console.log(req.cookies);

  if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email) && password) {
    const user = await User.findOne({ email });

    if (user) {
      if (await bcrypt.compare(password, String(user.password))) {
        res.cookie("auth", genToken(user._id), {
          // cookie is valid 30 day
          maxAge: 1000 * 60 * 60 * 24 * 30,
          httpOnly: true,
        });
        res.json({ success: true });
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
