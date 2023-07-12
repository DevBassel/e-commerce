import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { dbConnect } from "./config/DB.config";
import ip from "ip";
import auth from "./auth/authMiddelware";
import ErrorMiddelware from "./errors/ErrorMiddelware";
import AuthRouter from "./auth/authController";
import userRouter from "./user/userController";
import productRouter from "./products/productsController";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const baseUrl: string = "/api/v1";
// Middelware
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Routs
app.use(`${baseUrl}/auth`, AuthRouter);
app.use(`${baseUrl}`, auth, userRouter);
app.use(`${baseUrl}/products`, auth, productRouter);

// Error handler
app.use(ErrorMiddelware);

app.use("*", (req: Request, res: Response) =>
  res.status(404).json({ error: "NOT FOUND" })
);

// Start server
dbConnect(() => {
  app.listen(PORT, () => console.log(`live on http://${ip.address()}:${PORT}`));
});
