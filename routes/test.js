var express = require('express');
var router = express.Router();

var Post = require('../model/post');

router.post('/', function(req, res, next) {
        console.log(req.body);
	console.log('test for create post');
        var newPost = new Post({
          course_id: 'cs180',
          information: 'testing',
    main_post_id: '58b7b63f21e5b64f9460912d'
        });
	console.log('new post is cerated');
    Post.createPost(newPost, function(err,post) {
        console.log('creating the post');
	if(err) throw err;
  console.log(post);
	});
	res.sent(newPost);
   
});

router.get('/', function(req, res, next) {
      console.log('test for get main posts');
      Post.getPostByMainPost('58b7b63f21e5b64f9460912d',function(err, posts) {
        console.log('get course 58b7b63f21e5b64f9460912d');
	if(err) throw err;
	console.log(posts);
      });
  
});

module.exports = router;
