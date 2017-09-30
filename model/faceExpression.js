var mongoose = requir('mongoose');
var Schema = mongoose.Schema;

var FaceExpressionSchema = mongoose.Schema({
	userId: {
		type:String,
		index:true
	},
	result: {
		type:String
	}	
});

var FaceExpression =  module.exports = mongoose.model('FaceExpression', FaceExpressionSchema);

module.exports.createFaceExpression= function(newFaceExpression, callback){
	newFaceExpression.save(callback);
};

module.exports.getFaceExpressionByMentor = function(userId,callback){
     var query = {userId: userId};
     FaceExpression.find(query,callback);

};


