const db = require("./db.js");

const Block = function(database) {};


Block.blockUser = (user_id, other_id, result) => {
    let q = db.query(
        "INSERT INTO block (user_blocker, user_blocked) values (?,?) ON DUPLICATE KEY UPDATE user_blocker=user_blocker;",
        [user_id,other_id],
        (err, res) => {
            if (err) {
              result(err, null);
              return;
            } else {
              result(null, null);
              return;
    }});
}

Block.unblockUser = (user_id, other_id, result) => {
    db.query(
        "DELETE FROM block WHERE user_blocker=? AND user_blocked=?;",
        [user_id,other_id],
        (err, res) => {
            if (err) {
              result(err, null);
              return;
            } else {
              result(null, null);
              return;
    }});
}

Block.getBlocks = (user_id, result) => {
  db.query(
    "select user_id, username from user,block where block.user_blocker=? and block.user_blocked=user.user_id;",
    [user_id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      } else {
        result(null, res);
        return;
      }
    }
  )
}

module.exports = Block;