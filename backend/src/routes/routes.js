const auth = require("../utils/auth");
const authCheckNext = require("../utils/authCheckNext.js");
const { validateArrayOfString } = require("../utils/miscValidation.js");
const { check } = require("express-validator");

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

  // Friend Request Routes
  // send a friend request
  router.post(
    "/friend/request",
    authCheckNext.isOwner,
    auth,
    check("friend_user_id").notEmpty().isInt().toInt(),
    basic.sendFriendRequest
  );

  // approve a friend request
  router.patch(
    "/friend/request/approve",
    authCheckNext.isOwner,
    auth,
    check("friend_user_id").notEmpty().isInt().toInt(),
    basic.approveFriendRequest
  );

  // deny a friend request
  router.patch(
    "/friend/request/deny",
    authCheckNext.isOwner,
    auth,
    check("friend_user_id").notEmpty().isInt().toInt(),
    basic.denyFriendRequest
  );

  // block a user
  router.patch(
    "/friend/block",
    authCheckNext.isOwner,
    auth,
    check("friend_user_id").notEmpty().isInt().toInt(),
    basic.blockUser
  );

  // get pending friend requests for current user
  router.get(
    "/friend/requests",
    authCheckNext.isOwner,
    auth,
    basic.getPendingRequests
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
    basic.insertFriend
  );

  // delete friend of current user
  router.delete(
    "/friends",
    authCheckNext.isOwner,
    auth,
    check("friend_user_id").notEmpty().isInt().toInt(),
    basic.deleteFriend
  );

  app.use("/api", router);
};
