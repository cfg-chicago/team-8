var mongoose = require('mongoose');

var ratingSchema = mongoose.Schema({
    user_id: {
       type: String,
       index: true
    },
    post_id: {
       type: String
    }
});

var rating = module.exports = mongoose.model('rating', ratingSchema);

module.exports.createRating = function(newRating, callback) {
	console.log("creating the rating record");
	newRating.save(callback);
}

module.exports.checkUser = function(post_id, user_id,callback) {
	console.log("Looking throught the rating records");
	var query = {post_id : post_id, user_id : user_id};
	rating.findOne(query,callback);
}
