var express = require('express');
var router = express.Router();
var localStorage = require('localStorage');
var bodyParser = require('body-parser');
var User = require('../model/user');

/* GET home page. */
router.get('/', function(req, res, next) {
	if(!req.user) {
		res.render('index');
	}
	else {
		res.render('index', {
			username: req.user.username,
		});
	}
});

/* GET error page. */
router.get('/error', function(req, res, next) {
	if(!req.user) {

		res.render('error');
	}
	else {

		res.render('error', {
			username: req.user.username,
		});
	}
});




function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}


module.exports = router;
