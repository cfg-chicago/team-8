var express =require('express');
var async = require('async');
var router = express.Router();
var Mentor = require('../model/mentor');
var Student = require('../model/student');
var Team = require('../model/team');
var TeamReport = require('../model/teamReport');
var User = require('../model/user');
var bodyParser = require('body-parser');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var Handlebars = require('handlebars');
var CronJob = require('cron').CronJob;
var localStorage = require('localStorage'); 
app.use(bodyParser.json());

function loggedIn(req, res, next) {
  //console.log(req.user.avatar);
    if (req.user) {
        next();
    } else {
      req.flash('error_msg', 'You cannot access to the study notes page without logging in');
     // res.redirect('/');
    }
}

router.get('/', function(req,res,callback) {
    console.log('mentor page')
    var students = new Array();
    var team = new Object();
    var temp1 = new Array();
    console.log(req.user._id);
   /* async.series([
    	function(callback){
		    Student.getStudentByMentorId(req.user._id, function(err,studentI){
                var stringify = JSON.stringify(studentI);
		    	temp1 = JSON.parse(stringify);
                console.log(temp1);
                localStorage.setItem('students', temp1);
		    		for(var key in temp1){
		    			if(typeof temp1[key] != "undefined"){
		    			   students.push(temp1[key]);
                        }
		    		}
		    		consol.log("students" + students);
		         callback(null, students);
		    });
		 },
		 function(callback){
              console.log('test');
		 	Team.getTeamByMentorId(req.user._id, function(err,teamI){
		 	team = new Object(); 
            team = JSON.parse(JSON.stringify(teamI));
		 	callback(null,team);
		 	});
		 }
      
    ], function(err){
         console.log(test);
    	res.render('mentor',{
    		students:stduents,
    		team:team,
    		username:req.user.username
    	})
    })
*/
     
        res.render('mentor');
});

router.get('/student1', function(req,res,callback) {
    var students = JSON.parse(localStorage.getItem("students"));
    res.render('student', {
        student:students[0]
    })

});

router.get('/student2', function(req,res,callback) {
    var students = JSON.parse(localStorage.getItem("students"));
    res.render('student', {
        student:students[1]
    })

});
router.get('/student3', function(req,res,callback) {
    var students = JSON.parse(localStorage.getItem("students"));
    res.render('student', {
        student:students[2]
    })

});
router.get('/student4', function(req,res,callback) {
    var students = JSON.parse(localStorage.getItem("students"));
    res.render('student', {
        student:students[3]
    })
});

router.get('/teamReport',function(req,res,callback) {
    var team = JSON.parse(localStorage.getItem(""));
    res.render('teamreport', {
        team: team
    })
});

router.post('/teamReport', function(req,res,callback) {
    var Teamscore = req.body.score;
    var review = req.body.review;
    var photo = req.body.photo;
    var Team = JSON.parse(localStorage.getItem("Team"));
    var TeamID = Team.id 

    var newTeamReport = new TeamReport({
        TeamId: TeamID,
        Teamscore: Teamscore,
        review: review,
        photo: photo
       });
    res.redirect('/');

});

module.exports = router;
