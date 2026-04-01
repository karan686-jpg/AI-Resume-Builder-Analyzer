const express=require("express");
const app=express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(express.json())
app.use(cookieParser());
app.use(cors({
     origin: function (origin, callback) {
       if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     },
     credentials:true
}));


const authRouter= require("./routes/auth.routes");
const interviewRouter= require("./routes/interview.routes");
const aiRouter = require("./routes/ai.routes");
const imagekitRouter = require("./routes/imagekit.routes");






app.use("/api/auth", authRouter);
app.use("/api/interview",interviewRouter);
app.use("/api/ai", aiRouter);
app.use("/api/imagekit", imagekitRouter);

module.exports=app;