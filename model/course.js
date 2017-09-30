var express = require('express');
//var router = express.router();
var request = require('request');
var bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.json());

var myurl = 'http://api.purdue.io/odata/Courses?$filter=Subject/Abbreviation eq ';
var course = {
   url: '',
   method: 'GET',
   qs: {
	   '@data.context': "",
	   'value': []
   }
}

/*request(course, function(error, response, body){
   if(error) console.log(error);
	else {
	  var json = JSON.parse(body);
	  var first = json.value[0];
	  console.log(first);
	}
});*/


exports.searchCourse = function(coursename, callback){
	console.log(coursename);
	var subString;
	var countCourse = coursename.replace(/[^0-9]/g, "").length;
	console.log(countCourse);

	if (countCourse  == 5) {
		if (/\s/.test(coursename)) {
			subString = coursename.split(" ");
			course.url = myurl + ' \'' + subString[0] + '\'' + ' and Number eq ' + ' \'' + subString[1] + '\'';
		} else {
			var s1 = coursename.replace(/[0-9]/g, '');
			console.log(s1);
			var s2 = coursename.match(/\d/g);
			s2 = s2.join("");
			course.url = myurl + ' \'' + s1 + '\'' + ' and Number eq ' + ' \'' + s2 + '\'';
		}
	} else if (countCourse == 3) {
		if (/\s/.test(coursename)) {
			subString = coursename.split(" ");
			course.url = myurl + ' \'' + subString[0] + '\'' + ' and Number eq ' + ' \'' + subString[1] + '00\'';
		} else {
			var s1 = coursename.replace(/[0-9]/g, '');
			console.log(s1);
			var s2 = coursename.match(/\d/g);
			s2 = s2.join("");
			course.url = myurl + ' \'' + s1 + '\'' + ' and Number eq ' + ' \'' + s2 + '00\'';
		}
	} else {
		return callback(error);
	}
   	
   	request(course, function(error, response, body){

   	if(error) return callback(error);
	else {
	  var json = JSON.parse(body);
	  var first = json.value[0];
	  if(typeof first === 'undefined') return callback(new Error('can not find the course'));
	  console.log(first);
	  return callback(null, first);
	}
	});
};
