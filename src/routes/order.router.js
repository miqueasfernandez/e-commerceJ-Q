import express from "express";
import OrderController from "../controllers/order.controller.js";
const router = express.Router();

router.get("/", OrderController.getOrders);
router.get("/:id", OrderController.getOrdersById);
router.post("/", OrderController.addOrder);
router.post("/:cid", OrderController.generateOrderFromCart);

export default router;