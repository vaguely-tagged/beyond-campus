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
    var c = [];
    data.data.forEach((x) => {
      let i = Math.floor(Number(x.tag_number)/100);
      if (i==c.length) c.push({});
      c[i][x.tag_number]=x.content;
    });
    return c;
  });