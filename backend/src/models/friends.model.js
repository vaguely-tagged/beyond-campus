const db = require("./db.js");

const Friends = function (database) {};

// Get all friends for a user
Friends.getUserFriends = (user_id, result) => {
  db.query(
    "SELECT * FROM friends, user WHERE user.user_id = friends.friend_user_id AND friends.user_id = ? AND friends.status = 'accepted'",
    [user_id],
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

// Insert a friendship (direct add without a request; optional usage)
Friends.insertFriend = (user_id, friend_user_id, result) => {
  db.query(
    "INSERT INTO friends (user_id, friend_user_id, status) VALUES (?, ?, 'accepted') ON DUPLICATE KEY UPDATE status = 'accepted';",
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
};

// Delete a friend relationship
Friends.deleteFriend = (user_id, friend_user_id, result) => {
  db.query(
    "DELETE FROM friends WHERE user_id = ? AND friend_user_id = ?;",
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
