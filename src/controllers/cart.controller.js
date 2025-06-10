import ProductModel from "../dao/models/product.model.js";
import CartModel from "../dao/models/carts.model.js";
import { fastResponse } from "../utils/reusables.js";
import express from "express";
import cartRepositories from "../repositories/cart.repositories.js";
import userModel from "../dao/models/user.model.js";
import ticketModel from "../dao/models/ticket.model.js";
import { totalvalue } from "../utils/reusables.js";




class CartController {

    async createCart(req, res) {
        try {
            const newCart = await cartRepositories.createCart();
            await cartRepositories.saveCart(newCart);
            return res.status(201).json({ message: "Cart created successfully", cart: newCart });
            
        } catch (error) {
            console.error("Error creating cart:", error);
            return res.status(500).json({ error: "Error creating cart" });
            
        }
    }

    async getCartById(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepositories.getCartById(cartId);
            if (!cart) {
                return fastResponse(res, 404, "Cart not found");
            }
            return res.json(cart);
            
        } catch (error) {
            fastResponse(res, 400, error.message);
        }
    }

    async updateCart (req, res){
        const cartId = req.params.cid;
        const updatedCart = req.body;
    
        try {
            const cartUpdate = await CartModel.findByIdAndUpdate(cartId, updatedCart, { new: true });
            if (!cartUpdate) {
               throw new Error(`cannot update cart with id ${cartId}`);
               
            }
            
            res.status(200).json({ message: "Cart updated successfully", cart: cartUpdate });
            
        } catch (error) {
            console.error("Error updating cart:", error);
            res.status(500).json({ error: " Internal server error" });
        }
    }
    async AddProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            const CartProduct = await cartRepositories.getCartById(cartId);
            const existingProduct = CartProduct.products.find(p => p.product.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            }else {
                // console.log("before", CartProduct.products); DEPURATION
                CartProduct.products.push({ product: productId, quantity });
                // console.log("after", CartProduct.products); DEPURATION
                
            }
            CartProduct.markModified("products");

            await CartProduct.save();
            res.status(200).json(CartProduct);
        } catch (error) {   
            console.error("Error adding product to cart:", error);
            fastResponse(res, 400, error.message);
        }
    }
    async deleteProduct(req, res) {
        const cartId = req.params.cid;
        try {
            const deleteCart = await CartModel.findByIdAndDelete(cartId);
            if (!deleteCart) {
                fastResponse(res, 404, "Cart not found");
            }
            return res.json({ message: "Cart deleted successfully" });
        } catch (error) {
            fastResponse(res, 400, error.message);
        }
    }

    async purchaseCart (req,res){
        const cartId = req.params.cid;
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                return fastResponse(res, 404, "Cart not found");
            }
            const productArray = cart.products || [];
            const productNotallowed = [];
            for (const item of productArray) {
                const productId = item.product;
                const products = await ProductModel.findById(productId);
                if (products.stock >= item.quantity) {
                    products.stock -= item.quantity
                    await products.save();
                } else {
                    productNotallowed.push(productId);
                    console.log(productNotallowed, "quantity", productNotallowed.length);                   
                }                
            }
            const cartsUser = await userModel.findOne({cartId: cartId});
            if (!cartsUser) {
                return fastResponse(res, 404, "User not found for this cart");
            } 
            console.log("cartsUser is", cartsUser);

            const ticket = new ticketModel({
                purchased_datetime:  new Date(),
                amount: totalvalue(cart.products),
                purchaser: cartsUser.username,
            });
            await ticket.save();
            cart.products = cart.products.filter(item => !productNotallowed.some
                (productId => productId.equals(item.product)));
            
            cart.products = [];
            await cart.save();
            return res.status(200).json({ message: "Cart purchased successfully",
                ticketId: ticket._id,
                purchaser: ticket.purchaser,
                amount: ticket.amount,
                date: ticket.purchased_datetime
             });            
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "server error on /purchase" });
        }
    }

    
   async renderCartView(req, res) {
    const cartId = req.params.cid;
    try {
        const cart = await CartModel.findById(cartId).populate("products.product").lean(); //uses de cartmodel because cartRepositories not uses populate //lean() returns a plain javascript object
        res.render("cart", { cart: cart.products, cartId: cart._id.toString(), css: ["shared", "cart"] });
    } catch (error) {
        console.error("Error rendering cart:", error);
        res.status(500).send("Error rendering cart");
    }
}

}

export default new CartController();