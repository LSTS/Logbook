var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');


/* Create new File */
router.post('/:fileName', function (req, res, next) {

    console.log(req.body.data);

    
    var filePath = path.join('../api/markdownFiles/', req.params.fileName);

    try {
        if (fs.existsSync(filePath)) {
            console.log('File exist')
            res.send('File exist');
        }
        else {
            fs.appendFile(filePath, req.body.data, function (err) {
                if (err) {
                    throw err;
                }
                console.log("Created logkook (" + filePath + ")");
                res.send("File created");
            })
        }
    }
    catch (err) {
        console.log(err);
    }
    

});




module.exports = router;