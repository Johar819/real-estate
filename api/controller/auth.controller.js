const User = require('../models/user.model.js')
const bcryptjs = require('bcryptjs');
exports.signup = async (req,res)=>{
    const {username,email,password} = req.body;
    const hashedPassword =  bcryptjs.hashSync(password,10);
    const user = new User({
        username,
        email,
        password:hashedPassword
    });
    try{
        await user.save();
        res.status(201).json({
            message:"User created successfully",
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

exports.signin = (req,res)=>{}