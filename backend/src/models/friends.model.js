const db = require("./db.js");

const Friends = function (database) {};

Friends.getUserFriends = (user_id, result) => {
  db.query(
    "SELECT * FROM friends, user WHERE (user.user_id = friends.friend_user_id AND friends.user_id = ?) OR (user.user_id=friends.user_id AND friends.friend_user_id=?)",
    [user_id, user_id],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        // console.log("found friends: ", res);
        result(null, res);
        return;
      } else {
        result({ kind: "not_found" }, null);
      }
    }
  );
};

Friends.getUserRequests = (user_id, result) => {
  db.query(
    "SELECT user_id, username, bio, major, year FROM user WHERE user_id IN (SELECT sender FROM friendrequest WHERE receiver=?);",
    [user_id],
    (err,res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res);
        return;
      } else {
        result({ kind:"not_found"}, null);
      }
    }
  )
}

Friends.requestFriend = (user_id, friend_user_id, result) => {
  if (user_id < friend_user_id) var uid1 = user_id, uid2 = friend_user_id;
  else var uid1 = friend_user_id, uid2 = user_id;
  db.query(
    "SELECT * FROM friends WHERE user_id=? AND friend_user_id=?;",
    [uid1, uid2],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("already friends");
        result(null, null);
        return;
      }
      db.query(
        "SELECT * FROM friendrequest WHERE sender=? AND receiver=?;",
        [friend_user_id, user_id],
        (err, res) => {
          if (err) {
            result(err, null);
            return;
          }
          if (res.length) {
            console.log("already requested");
            Friends.insertFriend(user_id, friend_user_id, (err, res) => {
              result(err, null);
              return;
            });
            return;
          }
          db.query(
            "REPLACE INTO friendrequest (sender, receiver) VALUES (?,?)",
            [user_id, friend_user_id],
            (err, res) => {
              if (err) {
                result(err, null);
                return;
              } else {
                result(null, null);
                return;
              }
            }
          );
        }
      );
    }
  );
}

Friends.insertFriend = (user_id, friend_user_id, result) => {
  if (user_id < friend_user_id) var uid1 = user_id, uid2 = friend_user_id;
  else var uid1 = friend_user_id, uid2 = user_id;
  db.query(
    "INSERT INTO friends (user_id, friend_user_id) VALUES (?,?) ON DUPLICATE KEY UPDATE user_id = user_id;",
    [uid1, uid2],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      } else {
        // console.log("rows inserted");
        db.query(
          "DELETE FROM friendrequest WHERE (sender=? AND receiver=?) OR (sender=? AND receiver=?)",
          [user_id,friend_user_id,friend_user_id,user_id],
          (err, res) => {
            if (err) {
              result(err, null);
              return;
            } else {
              result(null, null);
              return;
            }
          }
        )
      }
    }
  );
};

Friends.rejectRequest = (user_id, request_id, result) => {
  db.query(
    "DELETE FROM friendrequest WHERE sender=? AND receiver=?;",
    [request_id, user_id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      } else {
        result(null, null);
        return;
      }
    }
  );
}

Friends.deleteFriend = (user_id, friend_user_id, result) => {
  if (user_id < friend_user_id) var uid1 = user_id, uid2 = friend_user_id;
  else var uid1 = friend_user_id, uid2 = user_id;
  db.query(
    "DELETE FROM friends WHERE user_id = ? AND friend_user_id = ?;",
    [uid1, uid2],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      } else {
        // console.log("rows deleted");
        result(null, null);
        return;
      }
    }
  );
};

module.exports = Friends;
