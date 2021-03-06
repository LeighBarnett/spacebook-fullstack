var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', function () {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


// You will need to create 5 server routes
// These will define your API:
// 1) to handle getting all posts and their comments
app.get('/posts', function (req, res) {
  Post.find(function (error, posts) {
    if (error) throw error;
    res.send(posts)
  });

});
// 2) to handle adding a post

app.post('/posts', function (req, res) {
  Post.create(req.body, function (error, post) {
    if (error) throw error;
    res.send(post)
  })
})
// 3) to handle deleting a post

app.delete('/posts/:deletePost', function (req, res) {
  var deletePost= req.params.deletePost;
  Post.findByIdAndRemove(deletePost,function (error, data) {
    if (error) throw error;
      res.send(data);
    })
  })

// 4) to handle adding a comment to a post
app.post('/posts/:postId/comments', function (req, res) {
  var postId=req.params.postId;
  Post.findByIdAndUpdate(postId,{$push: {"comments": req.body}}, function (error, data) {
    if (error) throw error;
    res.send(data)
  })
})

// 5) to handle deleting a comment from a post

app.delete('/posts/:postId/comments/:commentId', function (req, res) {
  var postId= req.params.postId;
  var commentId=req.params.commentId;
  Post.findByIdAndUpdate(postId,{$pull: {"comments": {_id: commentId}}},function (error, data) {
    if (error) throw error;
      res.send(data);
    })
  })


app.listen(8000, function () {
  console.log("what do you want from me! get me on 8000 ;-)");
});