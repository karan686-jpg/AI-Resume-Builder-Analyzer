const {Router}= require("express");
const authController= require("../controllers/auth.controller");
const authRouter= Router();

const authMiddleware= require("../middleware/auth.middleware");

//Register
authRouter.post("/register", authController.registerController);     
//Login
authRouter.post("/login", authController.loginUserConroller);

//logout 
authRouter.get("/logout", authController.logoutUserConroller);

//get-me
authRouter.get("/get-me", authMiddleware, authController.getMeController);

module.exports= authRouter; 