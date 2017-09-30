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
    async.series([
    	function(callback){
		    Student.getStudentByMentorId(req.user._id, function(err,studentI){
                var stringify = JSON.stringify(studentI);
		    	temp1 = JSON.parse(stringify);
                console.log(temp1);
                
		    		for(var key in temp1){
		    			if(typeof temp1[key] != "undefined"){
		    			   students.push(temp1[key]);
                        }
		    		}
		    		console.log("students" + students);
                   
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
     localStorage.setItem('student1', students[0]);
     localStorage.setItem('student2', students[1]);
     localStorage.setItem('student3', students[2]);
     localStorage.setItem('student4', students[3]);
    	res.render('mentor',{
    		student1:students[0].name,
            student2:students[1].name,
            student3:students[2].name,
            student4:students[3].name,
    		team_id:team.studentId,
    		username:req.user.username
    	})
    })

     
        //res.render('mentor');
});

router.get('/student1', function(req,res,callback) {
    
    var student = JSON.parse(JSON.stringify(localStorage.getItem('student1')));
    console.log("hi"+student.name);
    res.render('students', {
       student:student
    })

});

router.get('/student2', function(req,res,callback) {
  var student = JSON.parse(JSON.stringify(localStorage.getItem('student2')));  
    res.render('student', {
        student:studentz
    })

});
router.get('/student3', function(req,res,callback) {
      var student = JSON.parse(JSON.stringify(localStorage.getItem('student3')));
    res.render('student', {
        student:student
    })

});
router.get('/student4', function(req,res,callback) {
     var student = JSON.parse(JSON.stringify(localStorage.getItem('student4')));
    res.render('student', {
        student:student
    })
});

router.get('/teamReport',function(req,res,callback) {
    var team = JSON.parse(localStorage.getItem(""));
    res.render('teamreport', {
        team: team
    })
});

router.post('/teamReport', function(req,res,callback) {
    console.log(req.body);
    var teamscore = req.body.TeamScore;
    var review = req.body.Review;
    var photo = 0;
    var team = JSON.parse(JSON.stringify(localStorage.getItem("Team")));
    var teamID = Team._id 

    var newTeamReport = new TeamReport({
        teamId: teamID,
        t_eamscore: teamscore,
        review: review,
        photo: 0
       });
    res.redirect('/mentor');

});

module.exports = router;
