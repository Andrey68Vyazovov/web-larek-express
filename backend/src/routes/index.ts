import { Router } from "express";
import { createOrder, orderRouteValidator } from "../controllers/order";
import {
  createProduct,
  getProducts,
  productRouteValidator,
} from "../controllers/product";

const router = Router();
router.post("/order", orderRouteValidator, createOrder);
router.get("/product", getProducts);
router.post("/product", productRouteValidator, createProduct);

const routers = [router];

export default routers;
