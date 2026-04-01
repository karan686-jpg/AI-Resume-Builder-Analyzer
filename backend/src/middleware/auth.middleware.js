const tokenBlacklistModel= require("../models/blacklist.model");

const jwt= require("jsonwebtoken");

async function authUser(req, res, next){
    const token= req.cookies.token;
    if(!token){
        return res.status(400).json({message: "No token found"});
    }

    const isTokenBlacklisted= await tokenBlacklistModel.findOne({token});
    if(isTokenBlacklisted){
        return res.status(400).json({message: "Invalid token"});
    }

    try{
    const decodedToken= jwt.verify(token, process.env.JWT_SECRET);

    req.user= decodedToken;

    next();
    }catch(error){
        return res.status(400).json({message: "Invalid token"});
    }
}

module.exports= authUser;