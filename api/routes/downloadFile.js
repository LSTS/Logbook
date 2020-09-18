var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var markdownpdf = require('markdown-pdf');



/* downlaod file from server */
router.get('/:fileName', function (req, res, next) {

    var filePath = path.join('../api/markdownFiles/', req.params.fileName);

    try {
        if (fs.existsSync(filePath)) {
            console.log('File download - ' + req.params.fileName)
            res.download(filePath);
        }
        else {
            console.log('Downlaod - File not found (' + req.params.fileName + ')');
        }
    }
    catch (err) {
        console.log(err);
    }

});

/* download file from server pdf format */
router.get('/pdf/:fileName', function (req, res, next) {

    var filePath = path.join('../api/markdownFiles/', req.params.fileName);

    try {
        if (fs.existsSync(filePath)) {
            var fileDest = path.join('../api/markdownFiles/', req.params.fileName.substring(0, req.params.fileName.indexOf('.')) + '.pdf');

            markdownpdf({cssPath: '../api/public/stylesheets/pdf.css'}).from(filePath).to(fileDest, function () {
                res.download(fileDest, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        try {
                            fs.unlinkSync(fileDest);
                        }
                        catch (err) {
                            console.log(err);
                        }
                    }
                })
            });

        }
        else {
            console.log('Downlaod - File not found (' + req.params.fileName + ')');
        }
    }
    catch (err) {
        console.log(err);
    }
});


module.exports = router;