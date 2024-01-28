const User = require('../models/user.model.js')
const bcryptjs = require('bcryptjs');
exports.signup = async (req,res,next)=>{
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
        next(err);
    }
}

exports.signin = (req,res)=>{}