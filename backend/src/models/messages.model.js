const db = require("./db.js");

const Messages = function (database){};

Messages.sendMessage = (user, otherUser, body, result) => {
    db.query(
        "SELECT * FROM block WHERE user_blocker=? AND user_blocked=?;",
        [otherUser,user],
        (err, res) => {
            if (err) {
                result(err, null);
                return;
            } else if (res.length) {
                error = new Error("Access Denied");
                result(error, null);
                return;
            }
            db.query(
                "INSERT INTO messages (user_from,user_to,body) VALUES (?,?,?);",
                [user,otherUser,body],
                (err, res) => {
                    if (err) {
                        result(err, null);
                        return;
                    }
                    result(null, res);
                    return;
            });
    });
}

Messages.getMessages = (user, otherUser, result) => {
    db.query(
        "SELECT user_from,user_to,username,sent,body FROM user,messages WHERE (messages.user_to=? AND messages.user_from=? AND user.user_id=messages.user_from) OR (messages.user_to=? AND messages.user_from=? AND messages.user_to=user.user_id) ORDER BY sent;",
        [user, otherUser, otherUser, user],
        (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, res);
            return;
    });
}

Messages.getMessagePreviews = (user, result) => {
    db.query(
        "SELECT user_to,user_from,username,body FROM messages, user WHERE (messages.user_to=? AND messages.user_from=user.user_id) OR (messages.user_from=? AND messages.user_to=user.user_id) ORDER BY sent DESC;",
        [user,user],
        (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            var messages = {};
            res.forEach((mess) => {
                if (mess.user_to == user) {
                    if (messages[mess.user_from]) return;
                    messages[mess.user_from]={body: mess.body, username: mess.username};
                } else {
                    if (messages[mess.user_to]) return;
                    messages[mess.user_to]={body: mess.body, username: mess.username};
                }
            });
            result(err, messages);
            return;
    });
}

module.exports = Messages;