const { Router } = require("express");
const { authUser } = require("../middleware");
const authController = require("../controllers/auth.controller");

const authRouter = Router();

authRouter.post("/register", authController.registerController);
authRouter.post("/login", authController.loginUserController);
authRouter.post("/logout", authController.logoutUserController);
authRouter.get("/logout", authController.logoutUserController);
authRouter.get("/get-me", authUser, authController.getMeController);


module.exports = authRouter;