import { Router } from "express";
import { login, passwordReset, forgetPassword, register, resetPage } from "./authService";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/forget-password", forgetPassword);

router.route("/reset-password/:token").get(resetPage).post(passwordReset);

export default router;
