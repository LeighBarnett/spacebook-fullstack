var mongoose = require('mongoose');

//design the two schema below and use sub docs 
//to define the relationship between posts and comments

//you don't need a comments collection
//you only need a posts collection

var commentSchema = new mongoose.Schema({
text: String,
user:String
});


var postSchema = new mongoose.Schema({
text: String,
comments:[commentSchema]
});

var Post = mongoose.model('post', postSchema)
var post1= new Post({
    text: "post1",
})
post1.comments.push({username:"Bob", text: "Hi!"})
// post1.save(function(err,data){
//     if (err) {
//     console.error(err);
//   } else {
//     console.error(data);
//   }
// })
module.exports = Post
