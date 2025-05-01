const db = require("./db.js");

const Post = function (database) {};

Post.createPost = (user_id, title, body, result) => {
  db.query(
    "INSERT INTO post (user_id, title, body) VALUES (?, ?, ?)",
    [user_id, title, body],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      } else {
        result(null, res);
        return;
      }
    }
  );
};

Post.getAllPosts = (result) => {
  db.query(
    "SELECT p.*, u.username FROM post p JOIN user u ON p.user_id = u.user_id ORDER BY p.created_at DESC",
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      } else {
        result(null, res);
        return;
      }
    }
  );
};

Post.getPostById = (post_id, result) => {
  db.query(
    "SELECT p.*, u.username FROM post p JOIN user u ON p.user_id = u.user_id WHERE p.post_id = ?",
    [post_id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      } else if (res.length) {
        result(null, res[0]);
        return;
      } else {
        result({ kind: "not_found" }, null);
        return;
      }
    }
  );
};

module.exports = Post; 