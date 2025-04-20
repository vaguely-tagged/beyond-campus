import { getCookie } from "./getCookie.js";

function getTagsFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("user_id");
}
const user_id = getTagsFromURL();

const blockUserButton = document.querySelector(".block-user-button");
blockUserButton.addEventListener("click", () => {
  const jwt = getCookie("jwt");

  if (jwt) {
    // Include the token in the fetch request headers
    const headers = new Headers({
      Authorization: `${jwt}`,
      "Content-Type": "application/json",
    });
    fetch("/api/block", {
        method: "POST",
        headers,
        body: JSON.stringify({block_id: user_id}),
    })
    .then((response) => response.json())
    .then((result) => {
        window.confirm("User blocked!");
        window.location.href="/"
    })
    .catch((error) => {
        console.error("Error blocking user");
    });
  } else {
    console.error("JWT token not found in cookie");
    window.location.href = "/auth/logout";
  }
});

const unblockUserButton = document.querySelector(".unblock-user-button");
unblockUserButton.addEventListener("click", () => {
  const jwt = getCookie("jwt");

  if (jwt) {
    // Include the token in the fetch request headers
    const headers = new Headers({
      Authorization: `${jwt}`,
      "Content-Type": "application/json",
    });
    fetch("/api/block", {
        method: "DELETE",
        headers,
        body: JSON.stringify({block_id: user_id}),
    })
    .then((response) => response.json())
    .then((result) => {
        window.confirm("User unblocked!");
        window.location.href="/"
    })
    .catch((error) => {
        console.error("Error unblocking user");
    });
  } else {
    console.error("JWT token not found in cookie");
    window.location.href = "/auth/logout";
  }
});

const reportUserButton = document.querySelector(".report-user-button");
reportUserButton.addEventListener("click", () => {
  const jwt = getCookie("jwt");
  const notes = prompt("Why are you reporting this user?");

  if (jwt) {
    // Include the token in the fetch request headers
    const headers = new Headers({
      Authorization: `${jwt}`,
      "Content-Type": "application/json",
    });
    fetch("/api/report", {
        method: "POST",
        headers,
        body: JSON.stringify({report_id: user_id, message: "", notes: notes}),
    })
    .then((response) => response.json())
    .then((result) => {
        window.confirm("User reported!");
        window.location.href="/"
    })
    .catch((error) => {
        console.error("Error reporting user");
    });
  } else {
    console.error("JWT token not found in cookie");
    window.location.href = "/auth/logout";
  }
});