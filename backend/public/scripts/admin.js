import { getCookie } from "./getCookie.js"

window.addEventListener("load", () => {
    console.log("admin");
    // Get the JWT token from the cookie
    const jwt = getCookie("jwt");
    if (jwt) {
        const headers = new Headers({
          Authorization: `${jwt}`,
          "Content-Type": "application/json",
        });
        
        fetch("/api/user", {
            method: "GET",
            headers,
        })
        .then((response) => response.json())
        .then((userData) => {
            console.log(userData.perm);
            if (!userData.perm) {
                alert("Access Denied");
                window.location.href = "/";
            }
            else {
                document.body.style.visibility="visible";
            }
        })
        
    } else {
        console.error("JWT token not found in cookie");
        window.location.href = "/auth/logout";
    }
});