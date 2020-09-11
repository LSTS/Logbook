var express = require('express');
var router = express.Router();
var path = require('path');


// get path file
var appDir = path.dirname(require.main.filename);
console.log(appDir);
var teamFilePath = path.join(appDir, 'staticFiles/team.json');

var teamFile = require(teamFilePath);


// get list files
router.get('/', function (req, res, next) {
    res.json(teamFile);
});




module.exports = router;