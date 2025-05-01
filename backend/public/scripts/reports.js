import { getCookie } from "./getCookie.js";
const jwt = getCookie("jwt");

function createUserCard(report) {
    console.log(report);
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
        <h2>Report #${report.report_id}</h2>
        <p><strong>Message:</strong> ${report.message?report.message:"None"}</p>
        <p><strong>Notes:</strong> ${report.notes?report.notes:"None"}</p>
        <p><strong>Previous Reports:</strong> ${report.reports}</p>
        </div>
    `;

    const logButton = document.createElement("button");
    logButton.innerText = "Log report";
    logButton.addEventListener("click",() => logReport(report.user_reported, report.report_id));

    const delButton = document.createElement("button");
    delButton.innerText = "Delete report";
    delButton.addEventListener("click", () => deleteReport(report.report_id));

    const remButton = document.createElement("button");
    remButton.innerText = "Remove user";
    remButton.addEventListener("click", () => removeUser(report.user_reported));

    card.appendChild(logButton);
    card.appendChild(delButton);
    card.appendChild(remButton);
  return card;
}

window.addEventListener("load", () => {
    // Get the JWT token from the cookie
    const cardContainer=document.getElementById("user-cards");
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
                window.location.href = "/";
            }
            else {
                document.body.style.visibility="visible";
                fetch(`/admin/report`, {
                  method: "GET",
                  headers,
                })
                .then((response) => response.json())
                .then((data) => data.data)
                .then((data) => {
                    data.forEach((x) => {
                        cardContainer.appendChild(createUserCard(x));
                    });
                });
            }
        })
        
    } else {
        console.error("JWT token not found in cookie");
        window.location.href = "/auth/logout";
    }
});

const logReport = (user_id, report_id) => {
    if (jwt) {
        const headers = new Headers({
            Authorization: `${jwt}`,
            "Content-Type": "application/json",
        });
        fetch("/admin/report", {
            method: "POST",
            headers,
            body: JSON.stringify({user_id: user_id, report_id: report_id}),
        })
        .then((response) => response.json())
        .then((result) => {
            window.confirm("Report logged!");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error reporting user");
        });
    } else {
        console.error("JWT token not found in cookie");
        window.location.href = "/auth/logout";
    }
}

const deleteReport = (report_id) => {
    if (jwt) {
        const headers = new Headers({
            Authorization: `${jwt}`,
            "Content-Type": "application/json",
        });
        fetch("/admin/report",{
            method: "DELETE",
            headers,
            body: JSON.stringify({report_id: report_id}),
        })
        .then((response) => response.json())
        .then((result) => {
            window.confirm("Report deleted!");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error deleting report");
        })
    } else {
        console.error("JWT token not found in cookie");
        window.location.href = "/auth/logout";
    }
}

const removeUser = (report_id) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone")) return;
    if (jwt) {
        const headers = new Headers({
            Authorization: `${jwt}`,
            "Content-Type": "application/json",
        });
        fetch("/admin/users",{
            method: "DELETE",
            headers,
            body: JSON.stringify({user_id: report_id}),
        })
        .then((response) => response.json())
        .then((result) => {
            window.confirm("User removed!");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error deleting report");
        })
    } else {
        console.error("JWT token not found in cookie");
        window.location.href = "/auth/logout";
    }
}