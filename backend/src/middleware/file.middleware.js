const multer=require("multer");

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, "uploads/");
     },
     filename: (req, file, cb) => {
          cb(null, Date.now() + "-" + file.originalname);
     },
});

const upload = multer({ 
     storage :multer.memoryStorage(),
     limits:{
          fileSize:1024*1024*3
          
     }
});

module.exports= upload;