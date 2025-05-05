const db = require("./db.js");

const UserHashtag = function (database) {};

UserHashtag.getUserHashtags = (user_id, result) => {
  db.query(
    "SELECT * FROM userhashtag WHERE user_id = ?",
    [user_id],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        // console.log("found hashtags: ", res);
        result(null, res);
        return;
      }
    }
  );
};

UserHashtag.deleteHashtag = (user_id, tag_number, result) => {
  db.query(
    "DELETE FROM userhashtag WHERE user_id = ?",
    [user_id],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      } else {
        // console.log("rows deleted");
        console.log(tag_number);
        result(null, null);
        return;
      }
    }
  );
};

UserHashtag.insertHashtag = (user_id, tag_number, result) => {
  db.query(
    "INSERT INTO userhashtag (user_id, tag_number) VALUES (?, ?);",
    [user_id, tag_number],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      } else {
        // console.log("rows inserted");
        result(null, null);
        return;
      }
    }
  );
};

UserHashtag.getPotentialFriends = (user_id, tag_numbers, result) => {
  db.query(
    "SELECT * from userhashtag WHERE user_id != ? AND tag_number IN (?) AND user_id NOT IN (SELECT user_blocker FROM block WHERE user_blocked=? UNION SELECT user_blocked FROM block WHERE user_blocker=?);",
    [user_id, tag_numbers, user_id, user_id],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        // console.log("found users: ", res);
        result(null, res);
        return;
      } else {
        // console.log("cannot find users");
        result({ kind: "not_found" }, null);
      }
    }
  );
};

module.exports = UserHashtag;
