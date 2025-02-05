const db = require("./db.js");

const Friends = function (database) {};

// Get all friends for a user
Friends.getUserFriends = (user_id, result) => {
  db.query(
    "SELECT * FROM friends, user WHERE (user.user_id = friends.friend_user_id AND friends.user_id = ?) OR (user.user_id=friends.user_id AND friends.friend_user_id=?)",
    [user_id, user_id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
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

// Insert a friendship (direct add without a request; optional usage)
Friends.insertFriend = (user_id, friend_user_id, result) => {
  if (user_id < friend_user_id) var uid1 = user_id, uid2 = friend_user_id;
  else var uid1 = friend_user_id, uid2 = user_id;
  db.query(
    "INSERT INTO friends (user_id, friend_user_id) VALUES (?,?) ON DUPLICATE KEY UPDATE user_id = user_id;",
    [uid1, uid2],
    (err, res) => {
      if (err) {
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

// Delete a friend relationship
Friends.deleteFriend = (user_id, friend_user_id, result) => {
  if (user_id < friend_user_id) var uid1 = user_id, uid2 = friend_user_id;
  else var uid1 = friend_user_id, uid2 = user_id;
  db.query(
    "DELETE FROM friends WHERE user_id = ? AND friend_user_id = ?;",
    [uid1, uid2],
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
};

// Send a friend request
Friends.sendFriendRequest = (user_id, friend_user_id, result) => {
  db.query(
    "INSERT INTO friends (user_id, friend_user_id, status) VALUES (?, ?, 'pending') ON DUPLICATE KEY UPDATE status = 'pending';",
    [user_id, friend_user_id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { message: "Friend request sent!" });
    }
  );
};

// Approve a friend request
Friends.approveFriendRequest = (user_id, friend_user_id, result) => {
  db.query(
    "UPDATE friends SET status = 'accepted' WHERE user_id = ? AND friend_user_id = ?;",
    [friend_user_id, user_id], // Reverse order because the receiver approves
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { message: "Friend request approved!" });
    }
  );
};

// Deny a friend request
Friends.denyFriendRequest = (user_id, friend_user_id, result) => {
  db.query(
    "UPDATE friends SET status = 'denied' WHERE user_id = ? AND friend_user_id = ?;",
    [friend_user_id, user_id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { message: "Friend request denied!" });
    }
  );
};

// Block a user
Friends.blockUser = (user_id, friend_user_id, result) => {
  db.query(
    "UPDATE friends SET status = 'blocked' WHERE user_id = ? AND friend_user_id = ?;",
    [user_id, friend_user_id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { message: "User blocked!" });
    }
  );
};

// Fetch all pending friend requests for a user
Friends.getPendingRequests = (user_id, result) => {
  db.query(
    "SELECT * FROM friends, user WHERE user.user_id = friends.user_id AND friends.friend_user_id = ? AND friends.status = 'pending';",
    [user_id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

module.exports = Friends;
