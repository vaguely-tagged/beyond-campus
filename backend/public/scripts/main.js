import { getCookie } from "./getCookie.js";
import { category_noseparate } from "./category_noseparate.js";

function decodeHtmlEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function createUserCard(user) {
  const card = document.createElement("div");
  card.className = "user-card";
  card.innerHTML = `
          <a href="/profile?user_id=${user.user_id}"  style="color: black;"><img src="https://cdn.vectorstock.com/i/preview-1x/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg" alt="${user.username}">
          <h2>${user.username}</h2></a>
          <p><strong>Major:</strong> ${user.major}</p>
          <p><strong>Year:</strong> ${user.year}</p>
          <p><strong>Gender:</strong> ${user.gender}</p>
          <div class="hashtag-list class${user.user_id}">
          </div>
          <button class="remove-friend-button">Remove Friend</button>
      `;
  return card;
}

function createRequestCard(user) {
  const card = document.createElement("div");
  card.className = "user-card";
  card.innerHTML = `
          <a href="/profile?user_id=${user.user_id}"  style="color: black;"><img src="https://cdn.vectorstock.com/i/preview-1x/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg" alt="${user.username}">
          <h2>${user.username}</h2></a>
          <p><strong>Major:</strong> ${user.major}</p>
          <p><strong>Year:</strong> ${user.year}</p>
          <p><strong>Gender:</strong> ${user.gender}</p>
          <div class="hashtag-list class${user.user_id}">
          </div>
          <button class="request-button" id="reject">Reject Request</button>
          <button class="request-button" id="accept">Accept Request</button>
      `;

  return card;
}

const userCardsContainer = document.querySelector(".friends");
const requestContainer = document.querySelector(".requests");

window.addEventListener("load", () => {
  // Get the JWT token from the cookie
  const jwt = getCookie("jwt");

  if (!jwt) {
    console.error("JWT token not found in cookie");
    window.location.href = "/auth/logout";
  }
  // Include the token in the fetch request headers
  const headers = new Headers({
    Authorization: `${jwt}`,
    "Content-Type": "application/json",
  });

  fetch("/api/user", {
    method: "GET",
    headers,
  })
    .then((response) => {
      response.json()
        .then((userData) => {
          if (userData.perm) window.location.href = "/admin/adminCenter";

          // Update the username and bio on the page with fetched data
          const usernameElement = document.querySelector(".username");
          const bioElement = document.querySelector(".bio");
          const genderElement = document.querySelector(".gender");
          const yearElement = document.querySelector(".year");
          const majorElement = document.querySelector(".major");
          const registElement = document.querySelector(".registration_date");

          usernameElement.innerHTML = `<strong>${userData.username}</strong>`;
          bioElement.textContent =
            decodeHtmlEntities(userData.bio) || "Your bio is empty!";
          genderElement.textContent = userData.gender;
          yearElement.textContent = userData.year;
          majorElement.textContent = userData.major;
          registElement.textContent =
            "Joined: " +
            new Date(userData.registration_date).toLocaleDateString();
        })
        .catch((error) => {
          console.error("Error fetching user data json decode:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });

  fetch("/api/user/hashtag", {
    method: "GET",
    headers,
  })
    .then((response) => {
      response.json()
        .then((data) => {

          console.log("recieved data of", data)
          for (const hashtag of data.data) {
            const hashtagsDiv = document.querySelector(".hashtags");
            const hashtagSpan = document.createElement("span");
            hashtagSpan.className = "hashtag";
            category_noseparate.then((d) => {
              console.log(d);
              hashtagSpan.textContent =
                "#" + d[hashtag.tag_number];
            });
            hashtagsDiv.appendChild(hashtagSpan);
          }
        })
        .catch((error) => {
          console.error("Error fetching hashtag data json decode:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching hashtag data:", error);
    });

  fetch("/api/friends", {
    method: "GET",
    headers,
  })
    .then((response) => {
      response.json()
        .then((data) => {
          console.log("UP HERE DATA I GOT BACK IS", data)
          const friendsData = data.data;
          for (const friendData of friendsData) {
            const userCard = createUserCard(friendData);
            userCardsContainer.appendChild(userCard);
            const removeFriendButton = userCard.querySelector(
              ".remove-friend-button"
            );
            removeFriendButton.addEventListener("click", () => {
              // Make a POST fetch request with user_id as the request body
              if (
                window.confirm(
                  `Are you sure you want to remove ${friendData.username} from your friends list?`
                )
              ) {
                const user_id = friendData.user_id;
                fetch(`/api/friends`, {
                  method: "DELETE",
                  headers,
                  body: JSON.stringify({ friend_user_id: user_id }),
                })
                  .then((response) => {
                    response.json()
                      .then((result) => {
                        if (window.confirm("Friend removed!")) {
                          location.reload();
                        } else {
                          location.reload();
                        }
                        // You can add additional logic here, like showing a confirmation message.
                      })
                      .catch((error) => {
                        console.error("Error removing friend json decode:", error);
                      });
                  })
                  .catch((error) => {
                    console.error("Error removing friend:", error);
                  });
              }
            })
          }
        })
        .catch((error) => {
          console.error("Error fetching hashtag data json decode f ailed:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching hashtag data:", error);
    });

  fetch("/api/requests", {
    method: "GET",
    headers,
  })
    .then((response) => {
      response.json()
        .then((data) => {
          console.log("DATA I GOT BACK IS", data)
          const requestsData = data.data;
          for (const requestData of requestsData) {
            const requestCard = createRequestCard(requestData);
            requestContainer.appendChild(requestCard);
          
            // reject button
            const rejectFriendButton = requestCard.querySelector(
              "#reject"
            );
            rejectFriendButton.addEventListener("click", () => {
              // Make a DELETE fetch request with user_id as the request body
              if (
                window.confirm(
                  `Are you sure you want to reject ${requestData.username}'s friend request?`
                )
              ) {
                const req_id = requestData.user_id;
                fetch(`/api/requests`, {
                  method: "DELETE",
                  headers,
                  body: JSON.stringify({ request_id: req_id }),
                })
                  .then((response) => {
                    response.json()
                      .then((result) => {
                        if (window.confirm("Request rejected!")) {
                          location.reload();
                        } else {
                          location.reload();
                        }
                      })
                      .catch((error) => {
                        console.error("Error in reject accepting request json decode:", error);
                      })
                  })
                  .catch((error) => {
                    console.error("Error in reject accepting request:", error);
                  })
              }
            });
          
            // accept button
            const acceptFriendButton = requestCard.querySelector(
              "#accept"
            );
            acceptFriendButton.addEventListener("click", () => {
              const req_id = requestData.user_id;
              fetch(`/api/requests`, {
                method: "POST",
                headers,
                body: JSON.stringify({ friend_user_id: req_id }),              
              })
                .then((response) => {
                  response.json()
                    .then((result) => {
                      window.confirm("Request accepted!");
                      location.reload();
                    })
                    .catch((error) => {
                      console.error("Error accepting request json decode:", error);
                    })
                })
                .catch((error) => {
                  console.error("Error accepting request:", error);
                })
            });
          }
        })
    })

  // --- FORUM POSTS SECTION ---
  // Create a container for forum posts below friend requests
  const forumSection = document.createElement("section");
  forumSection.innerHTML = `
    <h2>Forum</h2>
    <form id="new-forum-post-form" style="margin-bottom: 1em;">
      <input type="text" id="forum-title" placeholder="Title" required style="margin-right: 0.5em;">
      <input type="text" id="forum-body" placeholder="Body" required style="margin-right: 0.5em;">
      <button type="submit">Post</button>
    </form>
    <div class="forum-posts"></div>
  `;
  // Insert after requests
  const requestsDiv = document.querySelector(".requests");
  if (requestsDiv && requestsDiv.parentNode) {
    requestsDiv.parentNode.appendChild(forumSection);
  }
  const forumPostsContainer = forumSection.querySelector(".forum-posts");

  // Handle new forum post submission
  const newForumPostForm = forumSection.querySelector("#new-forum-post-form");
  newForumPostForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = forumSection.querySelector("#forum-title").value.trim();
    const body = forumSection.querySelector("#forum-body").value.trim();
    if (!title || !body) return;
    fetch("/api/forum/posts", {
      method: "POST",
      headers,
      body: JSON.stringify({ title, body }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          forumSection.querySelector("#forum-title").value = "";
          forumSection.querySelector("#forum-body").value = "";
          loadForumPosts();
        } else {
          alert("Failed to create post.");
        }
      })
      .catch(() => alert("Error creating post."));
  });

  // Function to load and render forum posts
  function loadForumPosts() {
    forumPostsContainer.innerHTML = '<p>Loading forum posts...</p>';
    fetch("/api/forum/posts", {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          if (data.data.length === 0) {
            forumPostsContainer.innerHTML = '<p>No forum posts yet.</p>';
          } else {
            forumPostsContainer.innerHTML = "";
            data.data.forEach((post) => {
              const postDiv = document.createElement("div");
              postDiv.className = "forum-post";
              postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p><strong>By:</strong> ${post.username}</p>
                <p>${post.body}</p>
                <div class="forum-comments" id="forum-comments-${post.post_id}"></div>
                <form class="new-comment-form" data-post-id="${post.post_id}" style="margin-top:0.5em;">
                  <input type="text" class="comment-body" placeholder="Add a comment..." required style="margin-right:0.5em;">
                  <button type="submit">Comment</button>
                </form>
                <hr>
              `;
              forumPostsContainer.appendChild(postDiv);
              loadCommentsForPost(post.post_id);
              // Add event listener for new comment form
              const commentForm = postDiv.querySelector(".new-comment-form");
              commentForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const commentBody = commentForm.querySelector(".comment-body").value.trim();
                if (!commentBody) return;
                fetch(`/api/forum/posts/${post.post_id}/comments`, {
                  method: "POST",
                  headers,
                  body: JSON.stringify({ body: commentBody }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.success) {
                      commentForm.querySelector(".comment-body").value = "";
                      loadCommentsForPost(post.post_id);
                    } else {
                      alert("Failed to add comment.");
                    }
                  })
                  .catch(() => alert("Error adding comment."));
              });
            });
          }
        } else {
          forumPostsContainer.innerHTML = '<p>Failed to load forum posts.</p>';
        }
      })
      .catch(() => {
        forumPostsContainer.innerHTML = '<p>Error loading forum posts.</p>';
      });
  }

  // Function to load and render comments for a post
  function loadCommentsForPost(postId) {
    const commentsDiv = document.getElementById(`forum-comments-${postId}`);
    if (!commentsDiv) return;
    commentsDiv.innerHTML = '<em>Loading comments...</em>';
    fetch(`/api/forum/posts/${postId}/comments`, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          if (data.data.length === 0) {
            commentsDiv.innerHTML = '<em>No comments yet.</em>';
          } else {
            commentsDiv.innerHTML = data.data.map(
              (comment) => `<div class="forum-comment"><strong>${comment.user_id || comment.username || "User"}:</strong> ${comment.body}</div>`
            ).join("");
          }
        } else {
          commentsDiv.innerHTML = '<em>Failed to load comments.</em>';
        }
      })
      .catch(() => {
        commentsDiv.innerHTML = '<em>Error loading comments.</em>';
      });
  }

  // Initial load
  loadForumPosts();

  // --- NOTIFICATION BANNER ---
  function showNotificationBanner(message) {
    let banner = document.createElement("div");
    banner.className = "notification-banner";
    banner.style = "background: #842434; color: #fff; padding: 10px; text-align: center; position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;";
    banner.innerHTML = `
      <span>${message}</span>
      <button style='margin-left:20px; background:#fff; color:#842434; border:none; border-radius:3px; padding:2px 8px; cursor:pointer;'>X</button>
    `;
    banner.querySelector("button").onclick = () => banner.remove();
    document.body.prepend(banner);
  }

  // Fetch notifications and show banner if any
  fetch("/api/notifications", {
    method: "GET",
    headers,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        // Show the latest notification (or you can show all if you want)
        showNotificationBanner(data.data[0].content);
      }
    })
    .catch(() => {});
});