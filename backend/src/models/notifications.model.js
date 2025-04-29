const db = require("./db.js");

const Notification = function (database) {};

// Get all notifications for a user
Notification.getUserNotifications = (user_id, result) => {
  db.query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
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

// Mark notification as read
Notification.markAsRead = (notification_id, user_id, result) => {
  db.query(
    "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
    [notification_id, user_id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.affectedRows === 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, res);
      return;
    }
  );
};

// Create a new notification
Notification.createNotification = (user_id, type, content, result) => {
  db.query(
    "INSERT INTO notifications (user_id, type, content) VALUES (?, ?, ?)",
    [user_id, type, content],
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

module.exports = Notification;
