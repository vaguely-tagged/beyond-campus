const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");
const authCheckNext = require("../utils/authCheckNext.js");
const notificationController = require("../controllers/notification.js");

router.get("/", authCheckNext.isOwner, auth, notificationController.getUserNotifications);
router.patch("/:id/read", authCheckNext.isOwner, auth, notificationController.markAsRead);

module.exports = router;

