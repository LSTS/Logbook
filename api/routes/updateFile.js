var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');


/* update File */
router.post('/:fileName', function (req, res, next) {

    var filePath = path.join('../api/markdownFiles/', req.params.fileName);

    try {
        if (fs.existsSync(filePath)) {

            fs.writeFile(filePath , req.body.data, function (err) {
                if(err){
                    console.log(err);
                } else{
                    console.log('File updated');
                    res.send('File updated');
                }
            })

        }
        else {
            console.log('File not found');
            res.send('File not found');
        }
    }
    catch (err) {
        console.log(err);
    }
    

});




module.exports = router;