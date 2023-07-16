import { Router } from "express";
import {
  addItem,
  getUserCart,
  removeAllItem,
  removeCartItem,
  updateItem,
} from "./cartService";

const router = Router();

router.route("/").get(getUserCart).post(addItem).delete(removeAllItem);

router.route("/:id").put(updateItem).delete(removeCartItem);

export default router;
