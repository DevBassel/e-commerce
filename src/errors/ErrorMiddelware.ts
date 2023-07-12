import { NextFunction, Request, Response } from "express";
interface CustomErr extends Error {
  statusCode?: number;
}
export default function handleError(
  err: CustomErr,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.statusCode || 500).json({
    error: err.message,
    stack: process.env.NODE_ENV == "dev" ? err.stack : null,
  });
}
