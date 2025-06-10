import userRepositories from "../repositories/user.repositories.js";
import { createHash, isvalidPassword } from "../utils/hashbcrypt.js";
import cartRepositories from "../repositories/cart.repositories.js";
class UserService {
    async registerUser(userData) {
        //check if the user already exists:
        const existingUser = await userRepositories.getUserByUsername(userData.user); 
        if(existingUser) throw new Error("the user already exists"); 

        //create a new cart for the user: 
        const newcart = await cartRepositories.createCart(); 

        //add the new cart to the user:
        userData.cart = newcart._id;
        
        userData.password = createHash(userData.password); 
        return await userRepositories.createUser(userData); 
    }

    async loginUser(username, password) {
        const user = await userRepositories.getUserByUsername(username); 
        if(!user || !isvalidPassword(password, user.password)) throw new Error("the user or the password are incorrect, please enter existing user or password");
        return user; 
    }
}

export default new UserService(); 