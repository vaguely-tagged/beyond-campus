const auth = require("../utils/auth");
const generateAccessToken = require("../utils/generateAccessToken");
const authCheckNext = require("../utils/authCheckNext.js");
const { check } = require("express-validator");

module.exports = (app) => {
    const messages = require("../controllers/messages.js");

    var router = require("express").Router();

    router.get("/",messages.getMessagePage);

    router.post(
        "/",
        authCheckNext.isOwner,
        auth,
        messages.sendMessage
    );

    router.get(
        "/conversation/:user_id",
        authCheckNext.isOwner,
        auth,
        messages.getMessages
    );

    router.get(
        "/previews/",
        authCheckNext.isOwner,
        auth,
        messages.getMessagePreviews
    );

    router.get(
        "/conversation",
        messages.getConversationPage
    );

    app.use("/messages",router);
}