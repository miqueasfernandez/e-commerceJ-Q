import cartDao from "../dao/cart.dao.js";

class cartRepositories {
    async createCart(){
        return await cartDao.create();
    }

    async getCartById(id){
        return await cartDao.findById(id);
    }

    
    async saveCart(cart){
        return await cartDao.save(cart);
    }
}

export default new cartRepositories()