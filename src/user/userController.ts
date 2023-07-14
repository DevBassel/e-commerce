import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  profile,
  updateUser,
} from "./userService";

const router = Router();

router.get("/profile", profile);

router.get("/users/:id", getUserById);

router.get("/allUsers", getAllUsers);

router.route("/users/:id").delete(deleteUser).put(updateUser);

export default router;
