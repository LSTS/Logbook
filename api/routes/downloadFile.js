var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var AdmZip = require('adm-zip');

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

router.get('/zip/:fileName', function (req, res, next) {
    var filePath = path.join('../api/markdownFiles/', req.params.fileName);

    try {
        if (fs.existsSync(filePath)) {
            console.log('File download - ' + req.params.fileName);

            var reportName = req.params.fileName.substring(0, req.params.fileName.indexOf('.'));
            var reportPath = path.join('../api/markdownFiles/', reportName);

            //create dir for report 
            if (!fs.existsSync(reportPath)) {
                fs.mkdir(reportPath, function (err) {
                    if (err) { console.log(err); }
                    else {
                        //create aux md file
                        var fileTmpPath = path.join(reportPath, 'tmp_' + req.params.fileName);
                        fs.copyFile(filePath, fileTmpPath, function (err, data) {
                            if (err) { console.log(err); }
                            else {
                                fs.readFile(fileTmpPath, 'utf8', function (err, data) {
                                    if (err) { console.log(err); }
                                    else {
                                        //change image data
                                        var weather = data.substring(data.indexOf('### Weather') + 16);
                                        weather = weather.substring(0, weather.indexOf('### Systems') - 3);
                                        //console.log('--> ' + weather);

                                        var imageName = weather.split('/').pop();
                                        var imagePath = './img/' + imageName;

                                        if (weather !== "") {
                                            var result = data.replace(weather, imagePath);
                                            fs.writeFile(fileTmpPath, result, 'utf8', function (err) {
                                                if (err) { console.log(err); }
                                                else {
                                                    //copy image file
                                                    var reportImagePath = path.join(reportPath, '/img');
                                                    if (!fs.existsSync(reportImagePath)) {
                                                        fs.mkdir(reportImagePath, function (err) {
                                                            if (err) { console.log(err); }
                                                            else {
                                                                var imagePath = path.join('../api/uploads/', imageName);

                                                                fs.copyFile(imagePath, reportImagePath + '/' + imageName, function (err, data) {
                                                                    if (err) { console.log(err); }
                                                                    else {
                                                                        const zipFile = new AdmZip();
                                                                        var fileDest = path.join('../api/markdownFiles/', reportName + '.zip');

                                                                        zipFile.addLocalFolder(reportPath);
                                                                        fs.writeFileSync(fileDest, zipFile.toBuffer());
                                                                        zipFile.writeZip(fileDest);

                                                                        res.download(fileDest, function (err) {
                                                                            if (err) {
                                                                                console.log(err);
                                                                            }
                                                                            else {
                                                                                try {
                                                                                    fs.unlinkSync(fileDest);
                                                                                    fs.rmdirSync(reportPath, { recursive: true }, (err) => {
                                                                                        if (err) {
                                                                                            throw err;
                                                                                        }
                                                                                    });
                                                                                }
                                                                                catch (err) {
                                                                                    console.log(err);
                                                                                }
                                                                            }
                                                                        })

                                                                    }
                                                                })
                                                            }
                                                        });
                                                    }
                                                }
                                            })
                                        }
                                        else {
                                            const zipFile = new AdmZip();
                                            var fileDest = path.join('../api/markdownFiles/', reportName + '.zip');

                                            zipFile.addLocalFolder(reportPath);
                                            fs.writeFileSync(fileDest, zipFile.toBuffer());
                                            zipFile.writeZip(fileDest);

                                            res.download(fileDest, function (err) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                else {
                                                    try {
                                                        fs.unlinkSync(fileDest);
                                                        fs.rmdirSync(reportPath, { recursive: true } , (err) => {
                                                            if (err) {
                                                                throw err;
                                                            }   
                                                        });
                                                    }
                                                    catch (err) {
                                                        console.log(err);
                                                    }
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    }
                });
            }
        }
        else {
            console.log('Download - File not found (' + req.params.fileName + ')');
        }
    }
    catch (err) {
        console.log(err);
    }

    //res.send("FIM");


});

/* download file from server pdf format */
router.get('/pdf/:fileName', function (req, res, next) {

    var filePath = path.join('../api/markdownFiles/', req.params.fileName);

    try {
        if (fs.existsSync(filePath)) {
            var fileDest = path.join('../api/markdownFiles/', req.params.fileName.substring(0, req.params.fileName.indexOf('.')) + '.pdf');

            markdownpdf({ cssPath: '../api/public/stylesheets/pdf.css' }).from(filePath).to(fileDest, function () {
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
            console.log('Download - File not found (' + req.params.fileName + ')');
        }
    }
    catch (err) {
        console.log(err);
    }

    return;

});


function removeFiles(reportPath, fileDest) {
    console.log('Remove files');


}



function changeImageData(reportPath, fileTmpPath, data) {
    console.log('changeImageData');

    var weather = data.substring(data.indexOf('### Weather') + 16);
    weather = weather.substring(0, weather.indexOf('### Systems') - 3);
    console.log('--> ' + weather);

    var imageName = weather.split('/').pop();
    var imagePath = './img/' + imageName;

    if (weather !== "") {
        var result = data.replace(weather, imagePath);
        fs.writeFile(fileTmpPath, result, 'utf8', function (err) {
            if (err) { console.log(err); }
            else {
                //copy image file
                var reportImagePath = path.join(reportPath, '/img');
                if (!fs.existsSync(reportImagePath)) {
                    fs.mkdir(reportImagePath, function (err) {
                        if (err) { console.log(err); }
                        else {
                            var imagePath = path.join('../api/uploads/', imageName);

                            fs.copyFile(imagePath, reportImagePath + '/' + imageName, function (err, data) {
                                if (err) { console.log(err); }
                            })
                        }
                    });
                }
            }
        })
    }
}

module.exports = router;