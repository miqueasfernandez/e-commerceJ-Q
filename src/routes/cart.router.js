import express from "express";
import CartController from "../controllers/cart.controller.js";
const router = express.Router();

router.post("/", CartController.createCart);
//router.get("/:cid", CartController.getCartById); only for json
router.get("/:cid", CartController.renderCartView);
router.put("/:cid", CartController.updateCart);
router.post("/:cid/products/:pid", CartController.AddProductToCart);
router.delete("/:cid", CartController.deleteProduct);
router.get("/:cid/purchase", CartController.purchaseCart);

export default router;