import express from "express";
import { listProducts, getProductById, createProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", listProducts);
router.post("/", createProduct);
router.get("/:id", getProductById);

export default router;
