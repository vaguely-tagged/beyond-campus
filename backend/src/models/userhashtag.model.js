const db = require("./db.js");

const UserHashtag = function (database) {};

UserHashtag.getHashtags = (result) => {
  db.query(
    "SELECT * FROM hashtag",
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, res);
      return;
    }
  );
};

UserHashtag.getHashtagCategories = (result) => {
  db.query(
    "SELECT * FROM categories",
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, res);
      return;
    }
  )
}

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
    "SELECT * FROM userhashtag WHERE user_id != ? and tag_number in (?)",
    [user_id, tag_numbers],
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
