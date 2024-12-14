import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"; // Commented out Stripe import

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Commented out Stripe initialization

// Placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";
    try {
        const { paymentMethod, userId, items, amount, address } = req.body;

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod, // Store the payment method (Stripe or COD)
            status: paymentMethod === 'cod' ? 'Pending' : 'Unpaid' // Initial status for COD orders
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} }); // Cleaning user cart data

        // Stripe payment method block
         if (paymentMethod === 'stripe') {
             const line_items = items.map((item) => ({
                 price_data: {
                     currency: "pkr",
                     product_data: {
                         name: item.name,
                     },
                     unit_amount: item.price * 100,
                 },
                 quantity: item.quantity,
             }));

             line_items.push({
                 price_data: {
                     currency: "pkr",
                     product_data: {
                         name: "Delivery Charges",
                     },
                     unit_amount: 200 * 100,
                 },
                 quantity: 1,
             });

             const session = await stripe.checkout.sessions.create({
                 line_items: line_items,
                 mode: 'payment',
                 success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                 cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
             });

             res.json({ success: true, session_url: session.url });
         } else 
        if (paymentMethod === 'cod') {
            // For COD, just return a success response with the order ID
            res.json({ success: true, message: "Order placed successfully with Cash on Delivery", orderId: newOrder._id });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        const order = await orderModel.findById(orderId);

         //Stripe verification block
         if (order.paymentMethod === 'stripe') {
             if (success === "true") {
                 await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Paid" });
                 res.json({ success: true, message: "Paid" });
             } else {
                 await orderModel.findByIdAndDelete(orderId);
                 res.json({ success: false, message: "Not Paid" });
             }
         } else if (order.paymentMethod === 'cod') {
            // For COD orders, no need for Stripe verification
            res.json({ success: true, message: "Order confirmed with Cash on Delivery" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
};

// Users' orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
};

// API for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
