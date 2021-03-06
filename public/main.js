var SpacebookApp = function () {

  var posts = [];
  var $posts = $(".posts");

  function getData() {
    $.ajax({
      method: "GET",
      url: '/posts',
      success: function (data) {
        posts = data;
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }


  _renderPosts();

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      console.log(newHTML);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function addPost(newPost) {
    $.ajax({
      type: "POST",
      url: '/posts',
      data: {
        text: newPost
      },
      success: function (post) {
        getData();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };



  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function (postId) {
    $.ajax({
      type: "DELETE",
      url: '/posts/' + postId,
      success: function (data) {
        getData()
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  var addComment = function (newComment, postId) {
     $.ajax({
      type: "POST",
      url: '/posts/'+ postId + '/comments',
      data: newComment,
      success: function (data) {
        getData();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };


  var deleteComment = function (postId, commentId) {
     $.ajax({
      type: "DELETE",
      url: '/posts/' + postId + '/comments/' + commentId,
      success: function (data) {
        getData()
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  return {
    getData: getData,
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
  };
};
var app = SpacebookApp();
var $posts = $(".posts");

app.getData();

$('#addpost').on('click', function () {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    $input.val("");
  }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function () {
  var index = $(this).closest('.post').index();
  var postId = $(this).closest('.post').attr("data-id");
  app.removePost(postId);
});

$posts.on('click', '.toggle-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function () {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();
  var postId = $(this).closest('.post').attr("data-id");
  var newComment = {
    text: $comment.val(),
    user: $user.val()
  };

  app.addComment(newComment, postId);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function () {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var commentIndex = $(this).closest('.comment').index();
  var postId = $(this).closest('.post').attr("data-id");
  var commentId = $(this).closest('.comment').attr("data-id");

  app.deleteComment(postId, commentId);
});