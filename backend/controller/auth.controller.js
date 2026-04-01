const userModel= require("../src/models/user.model");
const bcryptjs= require("bcryptjs");
const jwt= require("jsonwebtoken");



const registerController= async(req, res)=>{
    const {username, email, password}= req.body;
    if(!username || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    }
    const existing_user= await userModel.findOne( { $or: [{email},{username}]});
    if(existing_user){
       return res.status(400).json({message: "User already exists"});
    }
    



//hash password

const hash= await bcryptjs.hash(password, 10);

 //create user
 const user= new userModel({username, email, password: hash});
 await user.save();


 // token generate
 const token= jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET, {expiresIn: "1h"});

 res.cookie("token", token, {httpOnly: true, maxAge: 60*60*1000});
 res.status(201).json({message: "User logged in successfully", user:{
     id:user._id,
     username:user.username,
     email:user.email
 },token});


}


//loginUserController

async function loginUserConroller(req,res){

     const {email, password}= req.body;
     if(!email || !password){
        return res.status(400).json({message: "All fields are required"});
     }
     const user= await userModel.findOne({email});
     if(!user){
        return res.status(400).json({message: "User not found"});
     }
     const isPasswordValid= await bcryptjs.compare(password, user.password);
     if(!isPasswordValid){
        return res.status(400).json({message: "Invalid password"});
     }
     const token= jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET, {expiresIn: "1h"});

     res.cookie("token", token, {httpOnly: true, maxAge: 60*60*1000});
     res.status(200).json({message: "User logged in successfully", user:{
         id:user._id,
         username:user.username,
         email:user.email
     },token});
}


//Logout

async function logoutUserConroller(req,res){
    const token= req.cookies.token;
    if(!token){
        return res.status(400).json({message: "No token found"});
    }
    const decodedToken= jwt.verify(token, process.env.JWT_SECRET);
    const tokenBlacklist= new tokenBlacklistModel({token});
    await tokenBlacklist.save();
    res.clearCookie("token");
    res.status(200).json({message: "User logged out successfully"});
}




//get-me

async function getMeController(req,res){
    const user= await userModel.findById(req.user.id);
    res.status(200).json({message: "User found successfully", user:{
     id:user._id,
     username:user.username,
     email:user.email
    }});
}


module.exports= {registerController, loginUserConroller, logoutUserConroller, getMeController};