import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  searchProducts,
  getSingleProduct,
  updateProduct,
} from "./productsService";
import isVendore from "../middelware/isVendore";

const router = Router();

router.route("/").get(searchProducts).post(isVendore, addProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .put(isVendore, updateProduct)
  .delete(isVendore, deleteProduct);

export default router;
