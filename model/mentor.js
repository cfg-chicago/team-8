var mongoose = requir('mongoose');
var Schema = mongoose.Schema;

var MentorSchema = mongoose.Schema({
	name: {
		type: String,
		index: true
	},
	userId: {
		type: String
	},
	
	sutdentId: {
		type: Number
	},
	faceId: {
		type: String 
	},
	teamId: {
		tyep:String
	}
});

var Mentor = module.exports = mongoose.module('Mentor', MentorSchema);

module.exports.createMentor = function(newMentor, callback){
	newMentor.save(callback);
};

module.exports.getMentorByUserId = function(userId, callback){
	var query = {userId: userId};
	Mentor.findOne(query,callback);
};

module.exports.getMentortByStudentId= function(studentId, callback){
	var query = {studentId: studentId};
	Mentor.find(query,callback);
};