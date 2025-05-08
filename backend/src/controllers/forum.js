const Post = require("../models/post.model.js");
const Comment = require("../models/comment.model.js");
const { validationResult } = require("express-validator");

// Create a new forum post
exports.createPost = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.session.nickname) {
    return res.status(400).json({ success: false, message: "no user" });
  }

  const { title, body } = req.body;
  const user_id = req.session.nickname;

  Post.createPost(user_id, title, body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${user_id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error creating post for user " + user_id,
        });
      }
    } else {
      res.send({
        success: true,
        message: "Post created successfully",
        data: data,
      });
    }
  });
};

// Get all forum posts
exports.getAllPosts = (req, res) => {
  Post.getAllPosts((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: "No posts found.",
        });
      } else {
        res.status(500).send({
          message: "Error retrieving posts",
        });
      }
    } else {
      res.send({
        success: true,
        data: data,
      });
    }
  });
};

// Get a single forum post by ID
exports.getPostById = (req, res) => {
  const post_id = req.params.post_id;

  Post.getPostById(post_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found post with id ${post_id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving post " + post_id,
        });
      }
    } else {
      res.send({
        success: true,
        data: data,
      });
    }
  });
};

exports.deletePost = (req, res) => {
  Post.deletePost(req.body.post_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found post with ID ${post_id}.`,
        });
      } else {
        res.status(500).send({
          message: "Not found post with ID " + post_id,
        });
      }
    } else {
      res.send({
        success: true,
        data: data,
      });
    }
  });
}

// Create a comment on a post
exports.createComment = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.session.nickname) {
    return res.status(400).json({ success: false, message: "no user" });
  }

  const { body } = req.body;
  const post_id = req.params.post_id;
  const user_id = req.session.nickname;

  Comment.createComment(user_id, post_id, body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found post with id ${post_id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error creating comment for post " + post_id,
        });
      }
    } else {
      res.send({
        success: true,
        message: "Comment created successfully",
        data: data,
      });
    }
  });
};

// Get all comments for a post
exports.getCommentsByPostId = (req, res) => {
  const post_id = req.params.post_id;

  Comment.getCommentsByPostId(post_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found comments for post ${post_id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving comments for post " + post_id,
        });
      }
    } else {
      res.send({
        success: true,
        data: data,
      });
    }
  });
}; 

exports.deleteComment = (req, res) => {
  Comment.deleteComment(req.body.comment_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found comment with ID ${comment_id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving comment with ID " + comment_id,
        });
      }
    } else {
      res.send({
        success: true,
        data: data,
      });
    }
  });
}