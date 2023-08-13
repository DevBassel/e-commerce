import { Router } from "express";
import {
  addItem,
  getUserCart,
  removeAllItem,
  removeCartItem,
  updateItem,
} from "./cartService";
import { checkOut } from "./cartCheckout";

const router = Router();

router.route("/").get(getUserCart).post(addItem).delete(removeAllItem);
router.post("/check-out", checkOut);

router.route("/:id").put(updateItem).delete(removeCartItem);

export default router;
