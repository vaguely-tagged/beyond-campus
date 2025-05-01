const Notification = require("../models/notifications.model.js");

// Fetch notifications for a user
exports.getUserNotifications = (req, res) => {
  if (!req.session.nickname) {
    return res.status(400).json({ success: false, message: "no user" });
  }

  Notification.getUserNotifications(req.session.nickname, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found notifications for user ${req.session.nickname}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving notifications for user " + req.session.nickname,
        });
      }
    } else {
      res.send({
        success: true,
        data: data,
      });
    }
  });
};

// Mark notification as read
exports.markAsRead = (req, res) => {
  if (!req.session.nickname) {
    return res.status(400).json({ success: false, message: "no user" });
  }

  Notification.markAsRead(req.params.id, req.session.nickname, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found notification with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating notification " + req.params.id,
        });
      }
    } else {
      res.send({
        success: true,
        message: "Notification marked as read.",
      });
    }
  });
};

// Create a new notification
exports.createNotification = (user_id, type, content) => {
  Notification.createNotification(user_id, type, content, (err, data) => {
    if (err) {
      console.error("Error creating notification:", err);
    }
  });
};
