const db = require("./db.js");

const Hashtag = function (database) {};

Hashtag.getHashtags = (result) => {
  db.query(
    "SELECT * FROM hashtag",
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, res);
      return;
    }
  );
};

Hashtag.addHashtag = (uid, cat, name, result) => {
  db.query(
    "SELECT permissions FROM user WHERE user_id = ?;",
    [uid],
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
        db.query("SELECT category_number FROM categories WHERE name=?;",
        [cat],
        (err, res) => {
          if (err) {
            result(err, null);
            return;
          }
          var cat_num = res[0].category_number;
          db.query("SELECT tag_number FROM hashtag WHERE category_number=?;",
            [cat_num],
            (err, res) => {
              if (err) {
                result(err, null);
                return;
              }
              var tag_numbers=[];
              res.forEach((x) => tag_numbers.push(x.tag_number));
    
              var new_tag=cat_num;
              if (tag_numbers.length == 0) new_tag += "01";
              else {
                var prev = Number(tag_numbers[tag_numbers.length-1].substring(2,4));
                if (tag_numbers.length == Number(prev)) {
                  new_tag += (prev <= 8) ?
                    "0" + String(prev + 1):
                    String(prev + 1);
                } else {
                  for (let i = 0; i < tag_numbers.length; ++i) {
                    if (tag_numbers[i].substring(2,4)!=i+1) {
                      new_tag += (i <= 8) ?
                        "0" + String(i+1):
                        String(i+1);
                      break;
                    }
                  }
                }
              }
    
              db.query("INSERT INTO hashtag (tag_number,content,category_number) VALUES (?,?,?);",
              [new_tag,name,cat_num],
              (err, res) => {
                if (err) {
                  result(err, null);
                  return;
                }
                result(null,null);
                return;
            })});
  })}});
}

Hashtag.removeHashtag = (uid, tag, result) => {
  db.query(
    "SELECT permissions FROM user WHERE user_id = ?",
    [uid],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
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
          "DELETE FROM hashtag WHERE tag_number= ?",
          [Number(tag)],
          (err, res) => {
            if (err) {
              result(err, null);
              return;
            }
            result(null, null);
            return;
        });
  }});
}

Hashtag.renameHashtag = (uid, tag, name, result) => {
    db.query(
      "SELECT permissions FROM user WHERE user_id = ?",
      [uid],
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
            `UPDATE hashtag SET content=? WHERE tag_number=?`,
            [name,tag],
            (err, res) => {
              if (err) {
                result(err, null);
                return;
              }
              result(null, null);
              return;
          });
    }});
}

module.exports = Hashtag;