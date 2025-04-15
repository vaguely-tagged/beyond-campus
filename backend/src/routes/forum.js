const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forum.js");
const auth = require("../utils/auth.js");
const { check } = require("express-validator");

// Create a new forum post (requires authentication)
router.post(
  "/posts",
  auth,
  [
    check("title").notEmpty().withMessage("Title is required"),
    check("body").notEmpty().withMessage("Body is required"),
  ],
  forumController.createPost
);

// Get all forum posts (no authentication required)
router.get("/posts", forumController.getAllPosts);

// Get a single forum post by ID (no authentication required)
router.get("/posts/:post_id", forumController.getPostById);

// Create a comment on a post (requires authentication)
router.post(
  "/posts/:post_id/comments",
  auth,
  [check("body").notEmpty().withMessage("Comment body is required")],
  forumController.createComment
);

// Get all comments for a post (no authentication required)
router.get("/posts/:post_id/comments", forumController.getCommentsByPostId);

module.exports = router; 