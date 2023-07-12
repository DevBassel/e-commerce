import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "./productsService";

const router = Router();

router.route("/").get(getAllProducts).post(addProduct);
router.route("/:id").put(updateProduct).delete(deleteProduct);

export default router;
