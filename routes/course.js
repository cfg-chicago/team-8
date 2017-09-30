var express = require('express');
var async = require('async');
var router = express.Router();
var course = require('../model/course');
var Post = require('../model/post');

var User = require('../model/user');
var bodyParser = require('body-parser');
var Post = require('../model/post');
var Rating = require('../model/rating');
var localStorage = require('localStorage');
var app = express();

var Note = require('../model/note');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var Handlebars = require('handlebars');
var CronJob = require('cron').CronJob;
app.use(bodyParser.json());


// Check if the user has logged in
function loggedIn(req, res, next) {
  //console.log(req.user.avatar);
    if (req.user) {
        next();
    } else {
      req.flash('error_msg', 'You cannot access to the study notes page without logging in');
      res.redirect('/course');
    }
}



router.post('/', function(req,res) {
      console.log("couse",req.body);
      localStorage.setItem('Course_id',req.body.Course_id);
      if(req.body.type === "Course Post")
        res.redirect('/course/discussion');
      else
        res.redirect('/course/notes');

});


router.get('/discussion', function(req,res,callback) {
      console.log("../course/discussion");
      var mainPostJson = new Array();
      var temp1 = new Array();
      var mostPopular = new Array();
      var replyJson;
      var temp = new Object();
      var rPosts = {"posts":[]};
      var i = 0;
      async.series([
  function(callback) {
           Post.getMostPopuPost(localStorage.getItem('Course_id'), function(err, post){
               mostPopular =JSON.parse( JSON.stringify(post));
		if(typeof mostPopular[0] != "undefined"){
		mainPostJson.push(mostPopular[0]);
		}
	       console.log( mainPostJson);
	     callback(null,post);
	   });
  },
  function(callback){
           Post.getPostByCourseId(localStorage.getItem('Course_id'),function(err,post){
            temp1 = JSON.parse(JSON.stringify(post));
		   for(var key in temp1){
                   	if(typeof temp1[key] != "undefined")
		   	mainPostJson.push(temp1[key]);
		   }
		   console.log(mainPostJson);
           callback(null, post);
         });
       },
  function(callback){
          async.eachSeries(mainPostJson,function(keys,callback) {
                async.series([
      function(callback1)
      {  if(typeof keys != "undefined"){
               Post.getPostByMainPost(keys._id, function(err, posts) {
        replyJson = new Object();
        if (err) callback(err,'err');
        console.log('reply'+posts);
        replyJson = JSON.parse(JSON.stringify(posts));
        callback1(null,posts);

               });
      }
	else   callback1(null);
      },
      function(callback2) {
      temp = new Object();
            temp.MainPost = keys; 
      temp.SubPosts = replyJson;
      rPosts.posts[i] = temp;
      i++;
      callback2();
      }
         ],function(err){    
       callback();  
         });
    },function(err){
      if(err) throw err;
            callback();
    });}
        ],function(err){
    console.log(rPosts.posts);
    try {
        res.render('discussion', {
          posts: rPosts.posts,
          username: req.user.username,
          point: req.user.point,
        });
        if(localStorage.getItem('ratingError') == 1){
		console.log('checking for error');
          req.flash('success_msg', 'Successfully uploaded a study note!');
	}
   
    } catch(err) {
        res.render('discussion', {
          posts: rPosts.posts
        });
    }
        });
});

router.post('/discussion', function(req,res,next) {
    console.log(req.body);
    var course_id = localStorage.getItem('Course_id');
    var main_post_id = req.body.main_post_id;
    /*if (typeof req.body.main_post_id !== undefined)
         main_post_id = req.body.main_post_id;*/
    console.log(main_post_id);
    var user_id = req.user.username;
    var information = req.body.information;
    var avator = req.user.avatar;
    console.log(information);
    console.log("avator" +avator);
    var date = new Date(),
		modifiedDate = date.toString().substr(0, date.toString().indexOf(' GMT'));
    var mainPost = new Post({
            information: information,
            course_id: course_id,
            user_id: user_id,
            main_post_id: main_post_id,
	    countUp:0,
	    countDown:0,
	    avator: avator,
	    date : modifiedDate

        });
  console.log(mainPost);
    Post.createPost(mainPost, function(err, post) {
         if(err) throw err;
          res.redirect('/course/discussion');
     });
});


router.post('/discussion/rating', function(req,res,next) {
    var main_post_id = req.body.main_post_id;
    var user_id = req.user.username;
	console.log(1);
	var temp;
   async.series([
	   function(callback){
             Rating.checkUser(main_post_id, user_id, function(err,result){
	    console.log('testing'+result);
	    temp = null;
	    temp = result;
	    callback();
           });
	   },
	   function(callback){
   		 console.log(temp);
   		 if(temp == null){
			localStorage.setItem('ratingError',0);
		  var rating = new Rating({
           		 user_id: user_id,
          		  post_id: main_post_id
        		});
   		 console.log(rating);
    	 	 Rating.createRating(rating, function(err, rating) {
         	  if(err) throw err;
   	 	});
   		 Post.updateRatingById(main_post_id, function(err,post){
         	if(err) throw err;
	   	callback(); 
   	 	});
			
		 } 
		   else{
		    localStorage.setItem('ratingError',1);
	            callback();
		   }
	   }],
	   function(err) {
	     if(err) return err;
	    res.redirect('/course/discussion');
	   });
    
});

router.post('/discussion/edit',function(req,res,next) {
   var post_id = req.body.main_post_id;
   var information = req.body.information;
   var date = new Date();
   var modifiedDate = date.toString().substr(0, date.toString().indexOf(' GMT')) + "*";
   Post.updatePostById(post_id, information, modifiedDate, function(err,post) {
     	if(err) throw err;
	   res.redirect('/course/discussion');
   });
  
});

router.post('/discussion/delete', function(req, res, next) {
  console.log("deleteing subpost");
  var main_post_id = req.body.main_post_id;
  var information = req.body.information;
  var check = req.body.main;
  var rPosts = {"id":[]} 
  if (check == 0){
	console.log("deleteing subpost");
	Post.deletePostById(main_post_id, function(err,post) {
	    if(err) throw err;
		res.redirect('/course/discussion');
	});
  }
  if(check == 1){
  	console.log("deleting mainpost's subpost");
	Post.deletePostByMainId(main_post_id, function(err,post){
	     if(err) throw err;
		Post.deletePostById(main_post_id, function(err,post){
		  if(err) throw err;
		     res.redirect('/course/discussion');
		});
	});
  } 
	
 });
/****************************************/
/************** Study Notes *************/
/****************************************/

var AWS = require('aws-sdk'),
    fs = require('fs');

// The accessKeyId has been deleted
AWS.config.update({ accessKeyId: 'X', secretAccessKey: 'X' });


router.get('/downloading', loggedIn, function(req,res,next) {
    // Deducting points when "download" is clicked
    var newPoint = req.user.point - 10;
    var query = {'username': req.user.username};
    // Update points in db
    User.findOneAndUpdate(query, {
      'point': newPoint
    }, {upsert: true},
    function(err, user){
      if(err) throw err;
    });
    res.render('downloading', {
        username: req.user.username,
        point: req.user.point
    });

  });


router.get('/notes', loggedIn, function(req,res,next) {

  // Reset number of uploading notes at midnight
  var resetNumberOfUploading = new CronJob('0 0 0 * * *', function() {
    var query = {'username': req.user.username};
      // Update number of uploading notes in the database
      User.findOneAndUpdate(query, {
        'numberOfUploading': 0
      }, {upsert: true},
      function(err, user){
        if(err) throw err;
      });
  }, undefined, true, "America/New_York");
  console.log(resetNumberOfUploading);

  // Check if the user can download and upload
  var flagDownload,
      flagUpload;
  if (req.user.point < 10) {
    flagDownload = false;
  }
  else {
    flagDownload = true;
  }

  if (req.user.numberOfUploading < 3) {
    flagUpload = true;
  }
  else {
    flagUpload = false;
  }
  Note.find({course_id:localStorage.getItem('Course_id')}).exec(function(err, notes) {

    if (err) {throw err;}

    res.render('notes', {
      "notes": notes,
      username: req.user.username,
      password: req.user.password,
      email: req.user.email,
      college: req.user.college,
      major: req.user.major,
      avatar: req.user.avatar,
      "canDownload": flagDownload,
      "canUpload": flagUpload,
      point: encodeURIComponent(JSON.stringify(req.user.point))
    });
  });
    /*
    io.on('connection', function(socket) {
        socket.on('downloadRequest', function(data) {
            var sockets = io.sockets.sockets;
            console.log('check');
        });
    });
*/
    /*
    // Deducting points when "download" is clicked
    var newPoint = req.user.point - 10;
    console.log(newPoint);
    var query = {'username': req.user.username};
    // Update points in db
    User.findOneAndUpdate(query, {
      'point': newPoint
    }, {upsert: true},
      function(err, user){
      if(err) throw err;
    });
*/
});


router.post('/notes', function(req, res, next) {


  Note.find({filename: req.body.studyNotes,course_id:localStorage.getItem('Course_id')}, function(err, docs) {
    if (docs.length) {
      console.log('notes?');
      req.flash('error_msg', 'The study note has already existed');
      return res.redirect('/course/notes');
    }
    else {
      if (req.body.studyNotes.length === 0) {
        req.flash('error_msg', 'You did not choose a file');
        return res.redirect('/course/notes');
      }
      // Read the file, convert to base64, and store to S3
      fs.readFile(req.body.studyNotes, function(err, data) {
        if (err) { throw err; }

        var base64data = new Buffer(data, 'binary');
        var s3 = new AWS.S3();

        s3.upload({
          Bucket: 'cs307team_8/study notes',
          Key: req.body.studyNotes,
          Body: base64data,
          ACL: 'public-read'
        }, function (err, res2) {
          var newPoint = req.user.point + 10;
          var newNumberOfUploading = req.user.numberOfUploading + 1;
          var query = {'username': req.user.username};
          // Update points in db
          User.findOneAndUpdate(query, {
            'point': newPoint,
            'numberOfUploading': newNumberOfUploading
          }, {upsert: true},
          function(err, user){
            if(err) throw err;
          });
          // get size in bytes
          var size = fs.statSync(req.body.studyNotes).size;
          // get link of the file
          var url = res2.Location;
          // get date of uploading the file
          var date = new Date(),
          modifiedDate = date.toString().substr(0, date.toString().indexOf(' GMT'));
          var user_id = req.user.username;
          var user_avatar = req.user.avatar;
          console.log(user_avatar);
          var newNote = new Note({
            user_id: user_id,
            filename: res2.Key,
 	    course_id:localStorage.getItem('Course_id'),
            //author: req.user.username,
            //avatar: req.user.avatar,
            link: url,
            size: size,
            time: modifiedDate,
            avatar: user_avatar
          });
          
          Note.createNote(newNote, function(err, note){
            if (err) throw err;
            console.log('The file has been successfully uploaded');
            return res.redirect('/course/notes');
          });
          req.flash('success_msg', 'Successfully uploaded a study note!');        
          
        });
      });
    }
  });
});


module.exports = router;
