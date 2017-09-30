var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamSchema = mongoose.Schema({
  studentId: {
  		type: String,
  		index: true
	     },
   mentorId: {
   		type: String
   },

   time: {
   		type: String
   	},
   point: {
   		type:String
    }
});

var Team = module.exports = mongoose.model('Team', TeamSchema);

module.exports.createTeam = function(newTeam, callback){
	newTeam.save(callback);
};

module.exports.getTeamByMentor = function(mentorId,callback){
     var query = {mentorId: mentorId};
     Team.findOne(query,callback);

};

module.exports.getTeamByStudent = function(studentId,callback){
	var query = {studentId: studentId};
	Team.findOne(query,callback);
};
