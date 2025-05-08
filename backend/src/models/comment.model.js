const db = require("./db.js");

const Comment = function (database) {};

Comment.createComment = (user_id, post_id, body, result) => {
  db.query(
    "INSERT INTO comment (user_id, post_id, body) VALUES (?, ?, ?)",
    [user_id, post_id, body],
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

Comment.getCommentsByPostId = (post_id, result) => {
  db.query(
    "SELECT c.*, u.username FROM comment c JOIN user u ON c.user_id = u.user_id WHERE c.post_id = ? ORDER BY c.created_at ASC",
    [post_id],
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

Comment.deleteComment = (comment_id, result) => {
  db.query(
    "DELETE FROM comment WHERE comment_id=?;",
    [comment_id],
    (err, res) => {
      if (err) {
        result(err,null);
        return;
      } else {
        result(null, res);
        return;
      }
    }
  );
}

module.exports = Comment; 