import { getCookie } from "./getCookie.js";

const messageList = document.querySelector(".message-list");
const user_id = getTagsFromURL();
const messageBox = document.getElementById("message-box");
var messages = [];
var openPopup;

function getTagsFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("user_id");
}

const postMessage = (message) => {
    var li = document.createElement("li");
    var received = message.user_from == user_id;
    if (received) li.className="to";
    else li.className="from";

    li.innerHTML=`<strong>${received ? message.username : "You"}</strong><br>${message.body}`;
    if (received) {
        li.classList.add("popup");
        const popupText = document.createElement("span");
        popupText.className = "popuptext";

        li.addEventListener("click", () => showPopup(popupText));

        const reportButton = document.createElement("button");
        reportButton.className = "option-button";
        reportButton.innerText = "Report comment";
        reportButton.addEventListener("click", () => reportComment(message.username,user_id,message.body));
        
        popupText.appendChild(reportButton);
        li.appendChild(popupText);
    }

    messageList.appendChild(li);
}

const showPopup = (element) => {
  element.classList.toggle("show");
  if (openPopup) {
      if (openPopup == element) openPopup=null;
      else {
          openPopup.classList.toggle("show");
          openPopup = element;
      }
  }
  else openPopup = element;
}

const reportComment = (username, user_id, comment) => {
  if (!window.confirm(`Are you sure you want to report ${username}?`)) return;
  const notes = prompt("Why are you reporting this user?");

  const jwt = getCookie("jwt");
  if (jwt) {
    // Include the token in the fetch request headers
    const headers = new Headers({
      Authorization: `${jwt}`,
      "Content-Type": "application/json",
    });
    fetch("/api/report", {
        method: "POST",
        headers,
        body: JSON.stringify({report_id: user_id, message: comment, notes: notes}),
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
}

const getNewMessages = () => {
    // Get the JWT token from the cookie
    const jwt = getCookie("jwt");
  
    if (!jwt) {
      console.error("JWT token not found in cookie");
      window.location.href = "/auth/logout";
      return;
    }
    // Include the token in the fetch request headers
    const headers = new Headers({
      Authorization: `${jwt}`,
      "Content-Type": "application/json",
    });
    fetch(`/messages/conversation/${user_id}`, {
        method: "GET",
        headers,
      })
          .then((response) => {
              response.json()
              .then((data) => {
                const m = data.data.filter((x) => x.user_from==user_id);
                if (m.length != messages.length) {
                    m.slice(messages.length).forEach((mess) => {
                        messages.push(mess);
                        postMessage(mess);
                    });
                }
              });
          });
}

window.addEventListener("load", () => {
    // Get the JWT token from the cookie
    const jwt = getCookie("jwt");
  
    if (!jwt) {
      console.error("JWT token not found in cookie");
      window.location.href = "/auth/logout";
      return;
    }
    // Include the token in the fetch request headers
    const headers = new Headers({
      Authorization: `${jwt}`,
      "Content-Type": "application/json",
    });
    fetch(`/messages/conversation/${user_id}`, {
        method: "GET",
        headers,
      })
          .then((response) => {
              response.json()
              .then((data) => {
                var mess = data.data;
                mess.forEach((message) => postMessage(message));
                messages = mess.filter((m) => m.user_from==user_id);
                setInterval(getNewMessages, 1000);
                window.location.href="#message-box";
              });
          });
});

document.getElementById("send-button").addEventListener("click", () => {
    const message = messageBox.value;
    const jwt = getCookie("jwt");
  
    if (!jwt) {
      console.error("JWT token not found in cookie");
      window.location.href = "/auth/logout";
      return;
    }
    // Include the token in the fetch request headers
    const headers = new Headers({
      Authorization: `${jwt}`,
      "Content-Type": "application/json",
    });
    fetch(`/messages`, {
        method: "POST",
        headers,
        body: JSON.stringify({user_id: user_id, body: message})
      })
          .then((response) => {
                var newMessage = {user_to: user_id, user_from: null, username: null, body: message};
                postMessage(newMessage);
                messageBox.value="";
                window.location.href="#message-box";
          });
});