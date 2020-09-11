var express = require('express');
var router = express.Router();

/* GET test api. */
router.get('/', function(req, res, next) {
  res.send('Test API is working');
});

module.exports = router;