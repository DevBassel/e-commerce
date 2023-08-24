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

const maxAge: number = 1000 * 60 * 60 * 24 * 30; // 30 day

// /api/v1/register    |   POST    |   public
// send email to verify email
export const register = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { name, email, password, rule } = req.body as RegisterDto;

    if (!name && !email && !password && !rule)
      next(CreateApiErr("enter valid data", 400));

    if (rule === "admin") next(CreateApiErr("bad rule ^_^", 400));

    // create verify code
    const code = Math.floor(Math.random() * 900000) + 100000;

    // save user in DB
    const user = await User.create({
      name,
      email,
      password,
      rule,
      code,
    });

    if (user) sendCode(code, email, res);

    // cookie is valid 30 day
    res.cookie("auth", genToken(user._id), {
      maxAge,
      httpOnly: true,
    });

    res.json({ msg: "check email to verify it && code is valid 2m ^_^ " });
  }
);

// verify email and create user
export const verifyEmail = asyncHandler(
  async (req: customReq, res: Response, next: NextFunction) => {
    const { email } = req.cookies;
    const { code } = req.body;

    if (!email) next(CreateApiErr("code is expired go to login", 403));

    const user = await User.findOne({ email }).select(["code", "verify"]);

    if (user?.verify) return next(CreateApiErr("email is verifyed", 400));

    if (user?.code !== Number(code)) return next(CreateApiErr("bad data", 400));

    const update = await User.updateOne(
      { _id: user?._id },
      {
        $set: { verify: true },
        $unset: { code },
      }
    );

    // cookie is valid 30 day
    res.cookie("auth", genToken(user._id), {
      maxAge,
      httpOnly: true,
    });

    res.json({ msg: "email is veriyfed ^_^ ", update });
  }
);

// /api/v1/login    |   POST    |   public
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as LoginDto;

    if (!email || !password)
      return next(CreateApiErr("Email or password is wrong", 403));

    // get user
    let user = await User.findOne({ email });

    if (!user) return next(CreateApiErr("User Not Found", 404));

    if (!(await bcrypt.compare(password, String(user?.password))))
      return next(CreateApiErr("not valid data", 400));

    // send code to verify email
    if (!user?.verify) {
      const code = Math.floor(Math.random() * 900000) + 100000;

      sendCode(code, email, res);

      await User.updateOne(
        { email },
        {
          $set: { code },
        }
      );
      console.log(code);
      return next(CreateApiErr("email not verify && check yor email ", 401));
    }

    // set cookie
    res.cookie("auth", genToken(user?._id), {
      // cookie is valid 30 days
      maxAge,
      httpOnly: true,
    });

    res.json({ msg: "loged in", success: true });
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

// going to reset password by link from email
export const resetPage = asyncHandler(async (req: customReq, res: Response) => {
  const { token } = req.params;
  jwt.verify(token, String(process.env.JWT_KEY)) as jwtPayload;

  res.json({ resetLink: "reset password page" });
});

const genToken = (id: any, expiresIn: string = "10d") => {
  return jwt.sign({ id }, String(process.env.JWT_KEY), { expiresIn });
};

const sendCode = (code: number, email: string, res: Response) => {
  let html = fs.readFileSync(
    `${__dirname}/../email-sender/templets/verify-email.html`,
    "utf8"
  );

  // add email and cod in email templet
  html = html.replace("{{EMAIL}}", email);
  html = html.replace("{{CODE}}", String(code));

  // send vode to email
  sendEmailService({
    to: email,
    subject: "Verify Your Email ^_^ ",
    html,
  });

  res.cookie("email", email, {
    httpOnly: true,
    maxAge: 1000 * 60 * 2,
  });
};
