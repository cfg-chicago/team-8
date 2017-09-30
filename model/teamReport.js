var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');

var TeamReportSchema = mongoose.Schema({
	teamId: {
		type:String 
	},
	teamscore: {
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
TeamReportSchema.plugin(timestamps);
//TeamReportSchema.model('TeamReport', TeamReportSchema);

var TeamReport  = module.exports = mongoose.model('TeamReport',TeamReportSchema);


module.exports.createTeamReport= function(newTeamReport,callback){
	newTeamReport.save(callback);
};