var express = require('express');
var router = express.Router();
var path = require('path');


// get path file
var appDir = path.dirname(require.main.filename);
console.log(appDir);
var vehicleFilePath = path.join(appDir, 'staticFiles/vehicles.json');

var vehicleFile = require(vehicleFilePath);


// get list files
router.get('/', function (req, res, next) {
    res.json(vehicleFile);
});




module.exports = router;