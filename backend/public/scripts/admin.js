import { getCookie } from "../public/getCookie.js"

window.addEventListener("load", () => {
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
            if (!userData.perm) {
                alert("Access Denied");
                window.location.href = "/auth/logout";
            }
            else {
                document.body.style.visibility="visible";
                headers.append("permissions",userData.perm);
            }
        })
        
    } else {
        console.error("JWT token not found in cookie");
        window.location.href = "/auth/logout";
    }
});