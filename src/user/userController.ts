import { Router } from "express";
import { deleteUser, getAllUsers, getUserById, profile } from "./userService";

const router = Router();

router.get("/profile", profile);

router.get("/users/:id", getUserById);

router.get("/allUsers", getAllUsers);

router.delete("/users/:id", deleteUser);

export default router;
