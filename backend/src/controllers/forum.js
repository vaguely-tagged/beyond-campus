const Post = require("../models/post.model.js");
const Comment = require("../models/comment.model.js");
const { validationResult } = require("express-validator");

// Create a new forum post
exports.createPost = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, body } = req.body;
  const user_id = req.user.user_id; // Assuming user is authenticated and user_id is available

  Post.createPost(user_id, title, body, (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(201).json({ message: "Post created successfully", data });
  });
};

// Get all forum posts
exports.getAllPosts = (req, res) => {
  Post.getAllPosts((err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(data);
  });
};

// Get a single forum post by ID
exports.getPostById = (req, res) => {
  const post_id = req.params.post_id;

  Post.getPostById(post_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(data);
  });
};

// Create a comment on a post
exports.createComment = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { body } = req.body;
  const post_id = req.params.post_id;
  const user_id = req.user.user_id; // Assuming user is authenticated and user_id is available

  Comment.createComment(user_id, post_id, body, (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(201).json({ message: "Comment created successfully", data });
  });
};

// Get all comments for a post
exports.getCommentsByPostId = (req, res) => {
  const post_id = req.params.post_id;

  Comment.getCommentsByPostId(post_id, (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(data);
  });
}; 