import { NextFunction, Request, Response } from "express";
import { LoginDto } from "./dto/loginDto";
import asyncHandler from "express-async-handler";
import { RegisterDto } from "./dto/registerDto";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CreateApiErr } from "../errors/customErr";
import { customReq } from "./dto/customReq";
import { jwtPayload } from "./dto/jwtDto";
import sendEmailService from "../email-sender/sendEmail.service";
import fs from "fs";

// /api/v1/register    |   POST    |   public
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, rule } = req.body as RegisterDto;
    if (rule === "admin") {
      next(CreateApiErr("bad rule ^_^", 400));
    } else {
      if (name && email && password && rule) {
        const user = await User.create({ name, email, password, rule });

        res.cookie("auth", genToken(user._id), {
          // cookie is valid 30 day
          maxAge: 1000 * 60 * 60 * 24 * 30,
          httpOnly: true,
        });
        res.json({
          name: user.name,
          _id: user._id,
          email: user.email,
          rule: user.rule,
        });
      } else next(CreateApiErr("enter valid data", 400));
    }
  }
);

// /api/v1/login    |   POST    |   public
export const login = asyncHandler(
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
            name: user.name,
            _id: user._id,
            email: user.email,
            rule: user.rule,
          });
        } else next(CreateApiErr("Email or password is wrong", 403));
      } else next(CreateApiErr("User Not Found", 404));
    } else next(CreateApiErr("not valid data", 400));
  }
);

// /api/v1/forgetPassword    |   POST    |   public
export const forgetPassword = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) next(CreateApiErr("user not found", 404));

    const token = genToken(user?._id, "2m");

    const link = `${process.env.HOST}/auth/reset-password/${token}`;

    // sent link to user email
    let html = fs.readFileSync(
      `${__dirname}/../email-sender/templets/email-resetPassword.html`,
      "utf8"
    );
    html = html.replace("{{EMAIL}}", email);
    html = html.replace("{{LINK}}", link);

    sendEmailService({ to: email, subject: "Reset Your Password", html });

    res.json({ msg: "check your email and email is valid 2m ^_^" });
  }
);

// send email to reset password
export const passwordReset = asyncHandler(
  async (req: customReq, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const { id } = jwt.verify(token, String(process.env.JWT_KEY)) as jwtPayload;

    const hash = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));

    console.log(hash);
    const updateUser = await User.updateOne(
      { _id: id },
      {
        $set: { password: hash },
      }
    );

    res.json({ updateUser });
  }
);

export const resetPage = asyncHandler(async (req: customReq, res: Response) => {
  const { token } = req.params;
  jwt.verify(token, String(process.env.JWT_KEY)) as jwtPayload;

  res.json({ resetLink: "reset password page" });
});

const genToken = (id: any, expiresIn: string = "10d") => {
  return jwt.sign({ id }, String(process.env.JWT_KEY), { expiresIn });
};
