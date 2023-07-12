import { Router } from "express";
import { addProduct, getAllProducts } from "./productsService";

const router = Router();

router.route("/").get(getAllProducts).post(addProduct);

export default router;
