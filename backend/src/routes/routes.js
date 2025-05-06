const auth = require("../utils/auth");
const authCheckNext = require("../utils/authCheckNext.js");
const { validateArrayOfString } = require("../utils/miscValidation.js");
const { check } = require("express-validator");
const forumRouter = require("./forum.js");
const notificationsRouter = require("./notifications.js");

module.exports = (app) => {
  const basic = require("../controllers/controller.js");

  var router = require("express").Router();

  // Protected routes
  // get info of current user
  router.get("/user", authCheckNext.isOwner, auth, basic.findCurrentUser);

  // get info of other users based on user_id
  router.get(
    "/friend",
    authCheckNext.isOwner,
    auth,
    check("user_id").notEmpty().isInt().toInt(),
    basic.findUser
  );
  // get all hashtags
  router.get(
    "/hashtags",
    authCheckNext.isOwner,
    auth,
    basic.getHashtags
  );
  // get hashtag categories
  router.get(
    "/hashtags/category",
    authCheckNext.isOwner,
    auth,
    basic.getCategories
  );
  // update bio of current user
  router.post(
    "/user/bio",
    authCheckNext.isOwner,
    auth,
    check("bio").notEmpty().isString().escape(),
    basic.updateBio
  );

  // update hashtags of current user
  router.post(
    "/user/hashtag",
    authCheckNext.isOwner,
    auth,
    validateArrayOfString("selectedValues"),
    basic.updateUserHashtag
  );

  // get hashtags of current user
  router.get(
    "/user/hashtag",
    authCheckNext.isOwner,
    auth,
    basic.getUserHashtags
  );

  // get hashtags of other user
  router.get(
    "/friend/hashtag",
    authCheckNext.isOwner,
    auth,
    check("user_id").notEmpty().isInt().toInt(),
    basic.getOtherUserHashtags
  );

  // get other users based on hashtags
  router.get(
    "/friends-hashtag",
    authCheckNext.isOwner,
    auth,
    (req, res, next) => {
      const tags = req.query.tags || ""; // Ensure it's a string, and provide a default empty string if it's not provided
      const sanitizedTags = tags.replace(/[^0-9,]/g, ""); // Remove any non-numeric or non-comma characters
      req.query.tags = sanitizedTags;
      next();
    },
    basic.getPotentialFriends
  );

  // get friends of current user
  router.get(
    "/friends",
    authCheckNext.isOwner,
    auth,
    basic.getCurrentUserFriends
  );

  // add friend to current user
  router.post(
    "/friends",
    authCheckNext.isOwner,
    auth,
    check("friend_user_id").notEmpty().isInt().toInt(),
    basic.requestFriend
  );

  // delete friend of current user
  router.delete(
    "/friends",
    authCheckNext.isOwner,
    auth,
    check("friend_user_id").notEmpty().isInt().toInt(),
    basic.deleteFriend
  );

  // get requests
  router.get(
    "/requests",
    authCheckNext.isOwner,
    auth,
    basic.getCurrentUserRequests
  );
  // accept request
  router.post(
    "/requests",
    authCheckNext.isOwner,
    auth,
    check("friend_user_id").notEmpty().isInt().toInt(),
    basic.insertFriend
  );
  // reject requests
  router.delete(
    "/requests",
    authCheckNext.isOwner,
    auth,
    check("request_id").notEmpty().isInt().toInt(),
    basic.rejectRequest
  );

  // block user
  router.post(
    "/block",
    authCheckNext.isOwner,
    auth,
    check("block_id").notEmpty().isInt().toInt(),
    basic.blockUser
  );

  // unblock user
  router.delete(
    "/block",
    authCheckNext.isOwner,
    auth,
    check("block_id").notEmpty().isInt().toInt(),
    basic.unblockUser
  );
  
  // get blocks
  router.get(
    "/block",
    authCheckNext.isOwner,
    auth,
    basic.getBlocks
  );

  // get blocks (blocker & blocked)
  router.get(
    "/block/all",
    authCheckNext.isOwner,
    auth,
    basic.getBlocked
  );

  // report user
  router.post(
    "/report",
    authCheckNext.isOwner,
    auth,
    check("report_id").notEmpty().isInt().toInt(),
    basic.reportUser
  );

  app.use("/api", router);
  app.use("/api/forum", forumRouter);
  app.use("/api/notifications", notificationsRouter);
};
