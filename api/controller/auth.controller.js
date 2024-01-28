const User = require('../models/user.model.js')
const bcryptjs = require('bcryptjs');
const { errorHandler } = require('../utils/error.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
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

exports.signin = async (req,res,next)=>{
    const {email,password} = req.body;
    try{
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404,"User not found"));
        }
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return next(errorHandler(401,"Incorrect Password"));
        }
        const {password:pass,...others} = validUser._doc;
        const token = jwt.sign({
            id:validUser._id,
        },process.env.JWT_SECRET);
        res.cookie("access_token",token,{    
            httpOnly:true,
        }).status(200).json({
            others
        });
        
    }catch(err){
        next(err);
    }
}