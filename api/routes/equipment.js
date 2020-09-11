var express = require('express');
var router = express.Router();
var path = require('path');


// get path file
var appDir = path.dirname(require.main.filename);
console.log(appDir);
var equipmentFilePath = path.join(appDir, 'staticFiles/equipment.json');

var equipmentFile = require(equipmentFilePath);


// get list files
router.get('/', function (req, res, next) {
    res.json(equipmentFile);
});



module.exports = router;