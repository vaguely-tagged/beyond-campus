const { DataTypes } = require("sequelize");
const db = require("./db");

const Notification = db.define("Notification", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("friend_request", "message", "system_alert"),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true
});

module.exports = Notification;
