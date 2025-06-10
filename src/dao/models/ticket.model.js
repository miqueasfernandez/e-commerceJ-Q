import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String, 
        required: true,
        unique: true,
        default: function(){
            return `TICKET-${Math.floor(Math.random() * 1000)}`
        }
    },

    purchased_datetime: {
        type: Date, 
        required: true
    },
    
    amount: {
        type: Number, 
        required: true
    },

    purchaser:{
        type: String,
        required: true
    }
})

const ticketModel = mongoose.model("tickets", ticketSchema);

export default ticketModel