import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type:String, required:true}, // Changed to ObjectId for proper relation
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    paymentMethod: { type: String, enum: ['stripe', 'cod'], required: true }, // New field for payment method
    payment: { type: Boolean, default: false },
    status: {type:String,default:"Item processing"}, // Modified status field
    date: { type: Date, default: Date.now }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
