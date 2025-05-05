const db = require("./db.js");

const User = function (database) {};

User.findById = (user_id, user, result) => {
  db.query("SELECT user_id,username,bio,major,year,gender,permissions FROM user WHERE user_id=? AND user_id NOT IN (SELECT user_blocker FROM block WHERE user_blocked=?);", [user_id,user], (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }
    result(null, null);
    return;
  });
};

User.updateBio = (user_id, bio, result) => {
  db.query(
    "UPDATE user SET bio = ? WHERE user_id = ?",
    [bio, user_id],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.info) {
        // console.log("updated bio: ", res);
        result(null, res);
        return;
      }

      // not found user with the id
      result({ kind: "not_found" }, null);
    }
  );
};

User.getAllUsers = (user_id, result) => {
  db.query(
    "SELECT permissions FROM user WHERE user_id = ?;",
    [user_id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      } else {
        if (!res[0].permissions) {
          err = new Error("Invalid request");
          console.log(err);
          result(err, null);
          return;
        }
        db.query(
          "SELECT username, email, user_id FROM user WHERE permissions=0;",
          (err, res) => {
            if (err) {
              result(err, null);
              return;
            }
            result(null, res);
            return;
        });
    }
  });
}

User.logReport = (user, user_id, result) => {
  db.query(
    "SELECT permissions FROM user WHERE user_id = ?;",
    [user],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      } else {
        if (!res[0].permissions) {
          err = new Error("Invalid request");
          console.log(err);
          result(err, null);
          return;
        }
        db.query(
          "UPDATE user SET reports = reports + 1 WHERE user_id = ?;",
          [user_id],
          (err, res) => {
            if (err) {
              result(err, null);
              return;
            }
            result(null, res);
            return;
        });
    }
  });
}

User.removeAccount = (user, user_id, result) => {
  db.query(
    "SELECT permissions FROM user WHERE user_id = ?;",
    [user],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      } else {
        if (!res[0].permissions) {
          err = new Error("Invalid request");
          console.log(err);
          result(err, null);
          return;
        }
        db.query(
          "INSERT INTO blacklist SELECT user_id, email FROM user WHERE user_id=?;",
          [user_id],
          (err, res) => {
            if (err) {
              result(err, null);
              return;
            }
            db.query(
              "DELETE FROM user WHERE user_id=?;",
              [user_id],
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
  });
}

module.exports = User;
