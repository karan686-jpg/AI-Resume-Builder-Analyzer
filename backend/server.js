const dotenv = require("dotenv");
dotenv.config();
const {generateInterviewReport}=require("./src/services/ai.service");
const app = require("./src/app");
const connectDB= require("./src/config/database");

connectDB();


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});