import userModel from '../models/userModel.js'

//add items to user cart 
const addToCart = async (req,res) => {
    try {
        let userData=await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        //if that item not in cart add new entry
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId]=1
        } //else add to existing one
        else{
            cartData[req.body.itemId]+=1
        }

        await userModel.findByIdAndUpdate(req.body.userId,{cartData}); //updates the cart data in database
        res.json({success:true,message:"Added to Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"}) 
    }
}


//remove items from user cart
const removeFromCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        //if the item we want to remove is >0
        if (cartData[req.body.itemId]>0) {
            cartData[req.body.itemId] -=1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Removed to Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }
}


//fetch user cart data
const getCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success:true,cartData})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

export {addToCart,removeFromCart,getCart};