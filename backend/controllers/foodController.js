import foodModel from "../models/foodModel.js";
import fs from 'fs'


//logic to add food item

const addFood = async (req,res)=>{
    let image_filename= `${req.file.filename}`

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image: image_filename
    })
    try{
        await food.save()
        res.json({success:true,message:'Item Added'})
    } catch(error){
        console.log(error)
        res.json({success:false,message:'Error'})
    }
}

//logic to all food list
const listFood= async (req,res) => {
    try{
        const foods= await foodModel.find({})
        res.json({success:true,data:foods})
    } catch (error){
        console.log(error)
        res.json({success:false,message:'Error'})
    }
}

// logic to remove food item
const removeFood = async (req,res)=>{
    try {
        const food= await foodModel.findById(req.body.id)
        fs.unlink(`uploads/${food.image}`,()=>{})
        await foodModel.findByIdAndDelete (req.body.id)
        res.json({success:true,message:'Food removed'})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:'Error'})
    }
}

export {addFood, listFood, removeFood}