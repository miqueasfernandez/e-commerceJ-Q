import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema( {
    items: [
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: true
        }
        
    }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    date: {
        type: Date, default: Date.now
    }
})

export default new mongoose.model("orders", OrderSchema);
