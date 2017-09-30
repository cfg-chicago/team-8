var express =require('express');
var async = require('async');
var router = express.Router();
var Mentor = require('../model/mentor');
var Student = require('../model/student');
//var Team = require('../model/team');
var User = require('../model/user');
var bodyParser = require('body-parser');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var Handlebars = require('handlebars');
var CronJob = require('cron').CronJob;
app.use(bodyParser.json());
/*
function loggedIn(req, res, next) {
  //console.log(req.user.avatar);
    if (req.user) {
        next();
    } else {
      req.flash('error_msg', 'You cannot access to the study notes page without logging in');
     // res.redirect('/');
    }
}
*/
router.get('/', function(req,res,callback) {
    console.log('mentor page')
    var students = new Array();
    var team = new Object();
    var temp1 = new Array();
 /*   async.series([

    	function(callback){
		    Stduent.getStudentByMentorId(req.user.id, function(err,student){
		    	temp1 = JSON.parse(JSON,stringify(post));
		    		for(var key in temp1){
		    			if(typeof temp1[key] != "undefined")
		    			students.push(temp1[key]);
		    		}
		    		consol.log("students" + students);
		         callback(null, students);
		    });
		 },
		 function(callback){
		 	Team.getTeamByMentorId(req.user.id, function(err,team){
		 	team = new Object(); 
		 	callback(null,team);
		 	});
		 }

    ], function(err){
    	res.render('mentor',{
    		students:stduents,
    		team:team,
    		username:req.user.username
    	})
    })*/
    res.render('mentor',{
        students:stduents,
        team:team,
        username:req.user.username
    })
});


module.exports = router;
