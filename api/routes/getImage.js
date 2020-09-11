var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');


// get image
router.get('/:fileName', function (req, res, next) {

    var imagePath = path.join('../api/uploads/', req.params.fileName);

    try {
        if (fs.existsSync(imagePath)) { 
            const absolutePath = path.join(__dirname, '../uploads/' + req.params.fileName);
            res.sendFile(absolutePath);
        }
        else {
            res.send('File not found');
        }
    }
    catch (err){
        console.log(err);
    }

});



module.exports = router;