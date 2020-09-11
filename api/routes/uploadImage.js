var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../api/uploads/');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });



router.post('/', upload.single('image'), (req, res, next) => {
    try {    
        return res.status(201).json({
            message: 'File uploaded successfully',
            fileName: req.file.filename
        });  
    } 
    catch(err){
        console.log(err);
    }    
});




module.exports = router;