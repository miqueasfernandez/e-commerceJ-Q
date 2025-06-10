import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    first_name: {
        type: String, 
        required: true
    },
    last_name: {
        type: String, 
        required: true
    },
    
    username:{
        type: String, 
        required: true
    }
    , 
    email: {
        type: String, 
        required: true,
        unique: true, 
        index: true
    }, 
    password: {
        type: String, 
        required: true,
        

    }, 
    age: {
        type: Number, 
        required: true
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        required: true
        
    },
    role: {
        type: String,
        default: "user"
    },
    profilePic: {
        type: String,
        default: "images/images.png" 
      }
})

const userModel = mongoose.model("users", Schema);

export default userModel