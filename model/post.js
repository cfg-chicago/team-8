var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
	information: {
	  type: String,
	  index: true
	},	
	course_id: {
	  type: String
	},
	user_id:{
	  type: String
	},
	date : {
	  type: String
        },
        timestamp : {
	  type: Date,
          default: Date.now
	},
	countUp : {
	  type: Number
	},
	main_post_id: {
	  type: String
	},
	avator : {
	  type: String
	}
 });

var post = module.exports = mongoose.model('post', postSchema);
module.exports.createPost = function(newPost, callback) {
    console.log('creating the post');
    newPost.save(callback);
}

module.exports.getMostPopuPost = function(course_id, callback) {
    console.log('get most popular post');
    var query = {course_id : course_id , main_post_id : '1'};
    post.find(query).sort({countUp: -1}).limit(1).exec(callback);
}

module.exports.getPostByCourseId = function(course_id, callback) {
    console.log('get post by course id');
    var query = {course_id : course_id, main_post_id : '1' };
    post.find(query).sort({timestamp:-1}).exec(callback);
    
}

module.exports.getPostByMainPost = function(post_id, callback) {
    var query = {main_post_id : post_id};
    post.find(query ,callback);
}

module.exports.deletePostById = function(post_id, callback) {
    var query = {_id : post_id};
    post.findOneAndRemove(query, callback);
}
module.exports.deletePostByMainId = function(post_id, callback) {
    var query = {main_post_id : post_id};
    post.remove(query,callback);


}
module.exports.updateRatingById = function(post_id,callback) {
    var query = {_id : post_id};
    post.findOneAndUpdate(
       query,
	    {$inc: {countUp : 1}},callback);
}

module.exports.updatePostById = function(post_id, information, date,callback) {
    var query = {_id : post_id};
	post.findOneAndUpdate(query, {$set : {information:information, date : date }}, callback);

}
