// dao/cart.dao.js
import CartModel from "../dao/models/carts.model.js";

class CartDao {
    async create() {
        const newCart = await CartModel({products: [] }); 
        return await newCart.save();
    }

    async findById(id) {
        return await CartModel.findById(id);
    }

    async save(cart) {
        const cartToSave = new CartModel(cart);
        return await cartToSave.save();
    }
}

export default new CartDao();