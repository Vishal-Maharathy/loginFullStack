const router = require('express').Router();
const {expenseCategoryModel} = require('../models/expenseCategoryModel');
const {expenseModel} = require('../models/expenses');

router.post('/postExpense', async(req, res)=>{
    try{
        let body = req.body
        let newExpense = new expenseModel({
            desc:body.desc,
            amount:body.amount,
            date:new Date().valueOf(),
            userId:req.userId,
            category:body.category,
            note:body.note
        })
        await newExpense.save()
        return res.status(200).json({success:true, message:"Expense added successfully!"})
    }catch(err){
        console.log(err)
        return res.status(400).json({success:false, error:err.message})
    }
})
router.get('/getExpenses', async(req, res)=>{
    try{
        let userId = req.userId
        let expenses = await expenseModel.find({userId:userId})
        return res.status(200).json({success:true, message:"Expense fetched successfully!", expenses:expenses})
    }catch(err){
        console.log(err)
        return res.status(400).json({success:false, error:err.message})
    }
})
router.get('/getExpCategory', async(req, res)=>{
    try{
        let userId = req.userId
        let categories = await expenseCategoryModel.findOne({userId:userId}, {category:1, _id:0})
        return res.status(200).json({success:true, message:"Categories fetched successfully!", categories:categories.category})
    }catch(err){
        console.log(err)
        return res.status(400).json({success:false, error:err.message})
    }
})
router.post('/postExpCategory', async(req, res)=>{
    try{
        let userId = req.userId
        let category = req.body.category
        let categories = await expenseCategoryModel.findOne({userId:userId})
        if(!categories){
            let newCategory = new expenseCategoryModel({
                userId:userId,
                category:[category]
            })
            await newCategory.save()
            return res.status(400).json({success:false, message:"not categoryModel found for this user, new categoryModel created!"})
        }
        if(categories.category.includes(category)){
            return res.status(400).json({success:false, message:"category already exists!"})
        }
        await expenseCategoryModel.findOneAndUpdate({userId:userId}, {$push:{category:category}})
        return res.status(200).json({success:true, message:"category pushed successfully!"})
    }catch(err){
        console.log(err)
        return res.status(400).json({success:false, error:err.message})
    }
})
module.exports = router