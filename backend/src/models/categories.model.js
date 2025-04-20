const db = require("./db.js");

const Categories = function(database) {};

Categories.getCategories = (result) => {
  db.query(
    "SELECT * FROM categories",
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, res);
      return;
  });
};

Categories.addCategory = (uid, name, result) => {
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
          db.query("SELECT category_number FROM categories;",
          (err, res) => {
            if (err) {
              result(err, null);
              return;
            }
            var cat_numbers=[];
            res.forEach((x) => cat_numbers.push(x.category_number));
  
            var new_number="";
            var prev = Number(cat_numbers[cat_numbers.length-1]);
            if (cat_numbers.length == Number(prev)+1) {
              new_number = (prev <= 8) ?
                "0" + String(prev + 1):
                String(prev + 1);
            }
            else {
              for (let i = 0; i < cat_numbers.length; ++i) {
                if (Number(cat_numbers[i])!=i) {
                  new_number = (i <= 9) ?
                    "0" + String(i):
                    String(i);
                  break;
                }
              }
            }
  
            db.query("INSERT INTO categories (category_number,name) VALUES (?,?);",
            [new_number,name],
            (err, res) => {
              if (err) {
                result(err, null);
                return;
              }
              result(null,null);
              return;
          })});
    }});
}

Categories.renameCategory = (uid, category, name, result) => {
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
            `UPDATE categories SET name=? WHERE name=?`,
            [name,category],
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

Categories.removeCategory = (uid, name, result) => {
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
            "DELETE FROM categories WHERE name= ?",
            [name],
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

module.exports = Categories;