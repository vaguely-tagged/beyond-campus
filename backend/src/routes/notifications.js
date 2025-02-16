const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");
const notificationController = require("../controllers/notification.js");

router.get("/", auth, notificationController.getUserNotifications);
router.patch("/:id/read", auth, notificationController.markAsRead);

module.exports = router;

