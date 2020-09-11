var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');



/* downlaod file from server */
router.get('/:fileName', function (req, res, next) {

    var filePath = path.join('../api/markdownFiles/', req.params.fileName);

    try {
        if (fs.existsSync(filePath)) {
            console.log('File download - ' + req.params.fileName)
            res.download(filePath);
        }
        else {
            console.log('Downlaod - File not found ('+req.params.fileName+')');
        }
    }
    catch (err) {
        console.log(err);
    }

});


module.exports = router;