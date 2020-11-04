var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

// get list files
router.get('/', function (req, res, next) {

    var dirPath = path.join('../api/markdownFiles/', '');

    var listFiles = [];

    fs.readdirSync(dirPath).forEach(file => {
        var type = fs.lstatSync(path.join(dirPath, file)).isDirectory();
        listFiles.push({ name: file, isDir: type });
    })

    res.send(listFiles);

});


/* GET file from server with param. */
router.get('/:fileName', function (req, res, next) {

    var filePath = path.join('../api/markdownFiles/', req.params.fileName);


    fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
        if (!err) {
            //console.log('received data: ' + data);
            //res.writeHead(200, { 'Content-Type': 'text/html' });
            res.send(data.toString());
        }
        else if (err.code === 'ENOENT') {
            console.log('File not found');
            //res.writeHead(200, { 'Content-Type': 'text/html' });
            res.send('File not found');
        }
        else {
            console.log(err);
        }
    });
});

//check if file exists
router.get('/exist/:fileName', function (req, res, next) {
    var filePath = path.join('../api/markdownFiles/', req.params.fileName);
    try {
        if (fs.existsSync(filePath)) {
            res.json({ result: true });
        }
        else {
            res.json({ result: false });
        }
    }
    catch (err) {
        console.log(err);
    }
});


// check report template
router.get('/type/:fileName', function (req, res, next) {

    var filePath = path.join('../api/markdownFiles/', req.params.fileName);
    try {
        if (fs.existsSync(filePath)) {

            fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
                if (!err) {

                    var template = checkFileTemplate(data);
                    res.send(template);
                }
                else if (err.code === 'ENOENT') {
                    console.log('Cannot read file - ' + req.params.fileName);
                    res.send('Cannot read file');
                }
                else {
                    console.log(err);
                }
            });
        }
        else {
            console.log("Cannot find file - " + req.params.fileName);
            res.send("Cannot find file");
        }
    }
    catch (err) {
        console.log(err);
    }

});



function checkFileTemplate(data) {
    var weather = data.indexOf('### Weather');
    var tides = data.indexOf('### Tides');

    if (weather === -1 || tides === -1) {
        return 'template_1';
    }
    else if (weather !== -1 || tides !== -1) {
        return 'template_2';
    }
    else {
        return 'template not found';
    }
}




module.exports = router;