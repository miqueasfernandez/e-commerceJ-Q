import ordersModel from "../dao/models/orders.model.js";
import { fastResponse } from "../utils/reusables.js";
import CartModel from "../dao/models/carts.model.js";

class OrderController {
    constructor(product, quantity, price) {
        this.product = product;
        this.quantity = quantity;
        this.price = price;
    }
        async getOrders (req, res) {
        try {
            const orders = await ordersModel.find();
            if (!orders || orders.length === 0) {
                return res.status(404).json({ message: "Order not found" });
            }
            return res.json(orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            fastResponse(res, 400, error.message);
        
        }
    }
    async getOrdersById(req, res){
        try {            
        const id = req.params.id;
        const order = await ordersModel.findById(id);
        if(!order||order.length === 0){
            return fastResponse(res, 404, "Order not found");
        }        
        return res.json(order);
        }
        catch (error) {  
            fastResponse(res, 400, error.message);          
        }
    }

    async addOrder (req, res) {
        try {
            const {items} = req.body;
            if (!items || items.length === 0) {
                return res.status(404).json({ message: "Order not found" });   
            } 
            const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0); // function to Calculate total price

            const newOrder = new ordersModel({
            items: items.map(item => ({ product: item.product, quantity: item.quantity, price: item.price })), // function to map items
            totalPrice
         });
           
            await newOrder.save();
            return fastResponse(res, 201, "Order created successfully");

        } catch (error) {
            console.error("Error creating order:", error);
            fastResponse(res, 400, error.message);
            
        }
    }

    async generateOrderFromCart(req, res) {
        console.log("GENERING ORDER:", req.params.cid);
    const cartId = req.params.cid;
        try {
            const cart = await CartModel.findById(cartId).populate("products.product");
            if (!cart || cart.products.length === 0) {
            return fastResponse(res, 404, "empty cart or cart not found");  // fuction to check if cart is empty
            }

            const items = cart.products.map(p => ({
            product: p.product._id,
            quantity: p.quantity,
            price: p.product.price
            })); // function to map items

            const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0); // function to Calculate total price

            const newOrder = new ordersModel({ items, totalPrice });
            await newOrder.save();
            

            return res.status(201).json({ message: "Order created successfully" });
        } catch (error) {
            console.error("Error creating order from cart:", error);
            return fastResponse(res, 400, error.message);
        }
    }

    
}

export default new OrderController();
