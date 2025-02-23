import { getCookie } from "./getCookie.js";
// Get the JWT token from the cookie
const jwt = getCookie("jwt");

// Include the token in the fetch request headers
const headers = new Headers({
  Authorization: `${jwt}`,
  "Content-Type": "application/json",
});

export const category = fetch("/api/hashtags", {
  method: "GET",
  headers
})
  .then((response) => response.json())
  .then((data) => {
    var d = data.data;
    var i = 0;
    return fetch("/api/hashtags/categories", {
      method: "GET",
      headers
    })
    .then((resp) => resp.json())
    .then((cat_data) => {
      var c = {};
      d.sort((a,b) => 
        a.category_number - b.category_number
      );
      cat_data.data.forEach((x) => {
        c[x.name] = [];
        while (d[i].category_number == x.category_number) {
          c[x.name].push(d[i]);
          i++;
          if (i == d.length) break;
        }
      });
      return c;
    });
  });