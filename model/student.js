var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = mongoose.Schema({
	name: {
		type: String,
		index: true
	},
	userId: {
		type:String
	},
	gradeLevel: {
		type: Number
	},
	ticketCount: {
		type: Number
	},
	mentorId: {
		type: Number
	},
	faceId: {
		type: String 
	},
	teamId: {
		tyep:String
	}	
});

var Student = module.exports = mongoose.model('Student', StudentSchema);

module.exports.createStudent = function(newStrudent, callback){
	newStudent.save(callback);
};

module.exports.getStudentById = function(student_id, callback){
	var query = {_id: student_id};
	Student.findOne(query,callback);
};

module.exports.getStudentByMentorId = function(mentorId, callback){
	var query = {mentorId: mentorId};
	Student.find(query,callback);
};