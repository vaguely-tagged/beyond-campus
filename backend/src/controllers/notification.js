const Notification = require("../models/notifications.model.js");

// Fetch notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { id: req.params.id, user_id: req.user.id } }
    );
    res.json({ message: "Notification marked as read." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update notification." });
  }
};

// Create a new notification
exports.createNotification = async (user_id, type, content) => {
  try {
    await Notification.create({ user_id, type, content });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
