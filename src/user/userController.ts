import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  profile,
  updateUser,
} from "./userService";
import isAdmin from "../middelware/isAdmin";

const router = Router();

router.get("/profile", profile);

router.get("/users/:id", isAdmin, getUserById);

router.get("/allUsers", isAdmin, getAllUsers);

router.route("/users/:id").delete(deleteUser).put(updateUser);

export default router;
