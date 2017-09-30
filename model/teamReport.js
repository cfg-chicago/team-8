var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');

var TeamReportSchema = mongoose.Schema({
	TeamId: {
		type:String 
	}
	Teamscore: {
		type:String,
		index: true 
	},
	review: {
		type: String
	},
	photo: {
		type: String 
	}
});
UserSchema.plugin(timestamps);
TeamReportSchema.model('Team', TeamReportSchema);

var Team = mongoose.model('Team',TeamReportSchema);

module.exports.createTeamReport= function(newTeamReport,callback){
	newTeamReport.save(callback);
};