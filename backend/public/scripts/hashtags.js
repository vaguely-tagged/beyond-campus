import { category } from "./category.js";
import { getCookie } from "./getCookie.js";
const jwt = getCookie("jwt");

var openPopup;
var headers;

const createCell = (row, tag) => {
    const c = row.insertCell();
    c.value=tag.tag_number;
    c.id=tag.tag_number;
    c.innerText=tag.content;
    c.name=tag.content;
    
    var popupId = "pop" + tag.tag_number;
    c.className = "popup";
    c.addEventListener("click", () => showPopup(popupId));

    const popupText = document.createElement("span");
    popupText.className = "popuptext";
    popupText.id = popupId;

    var editButton = document.createElement("button");
    editButton.className = "option-button";
    editButton.innerText = "Edit Tag Name";
    editButton.addEventListener("click", () => editTag(tag.tag_number));

    var deleteButton = document.createElement("button");
    deleteButton.className = "option-button";
    deleteButton.innerText = "Delete Tag";
    deleteButton.addEventListener("click", () => deleteTag(tag.tag_number));

    popupText.appendChild(editButton);
    popupText.appendChild(deleteButton);
    c.appendChild(popupText);
}

const createCatPopup = (cell,name) => {
    const popupId = "pop" + name;
    cell.addEventListener("click",() => showPopup(popupId));
    
    const popupText = document.createElement("span");
    popupText.className = "popuptext";
    popupText.id = popupId;

    const addButton = document.createElement("button");
    addButton.className = "option-button";
    addButton.innerText="Add Tag";
    addButton.addEventListener("click", () => addTag(name));

    const renameButton = document.createElement("button");
    renameButton.className="option-button";
    renameButton.innerText="Rename Category";
    renameButton.addEventListener("click",() => renameCategory(name));

    const deleteButton = document.createElement("button");
    deleteButton.className = "option-button";
    deleteButton.innerText = "Delete Category";
    deleteButton.addEventListener("click",() => deleteCategory(name));

    popupText.appendChild(addButton);
    popupText.appendChild(renameButton);
    popupText.appendChild(deleteButton);
    cell.firstChild.appendChild(popupText);
}

window.addEventListener("load", () => {
    document.getElementById("new-category").addEventListener("click",()=>addCategory());

    const table = document.createElement("table");
    document.getElementById("tags").appendChild(table);
    var head = table.appendChild(document.createElement("thead"));
    head.appendChild(document.createElement("th")).appendChild(document.createTextNode("Category"));
    head.appendChild(document.createElement("th")).appendChild(document.createTextNode("Tags"));
    category.then((data) => {
        console.log(data);
        Object.keys(data).forEach((x) => {
            var row = table.insertRow();
            var cat = row.insertCell();
            cat.appendChild(document.createElement("span"));
            cat.firstChild.innerHTML=x;
            cat.className="category";
            createCatPopup(cat,x);
            data[x].forEach((y) => {
                createCell(table.insertRow(),y);
                ++cat.rowSpan;
            });
        });
    });
    // Get the JWT token from the cookie
    const jwt = getCookie("jwt");
    if (jwt) {
        headers = new Headers({
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
            }
        })
        
    } else {
        console.error("JWT token not found in cookie");
        window.location.href = "/auth/logout";
    }
});

const showPopup = (id) => {
    const popup = document.getElementById(id);
    popup.classList.toggle("show");
    if (openPopup) {
        if (openPopup == id) openPopup=null;
        else {
            document.getElementById(openPopup).classList.toggle("show");
            openPopup = id;
        }
    }
    else openPopup = id;
}

const addCategory = () => {
    var newName = prompt(`Enter name of new category`);
    fetch("/admin/hashtags/category/new", {
        method: "POST",
        body: JSON.stringify({"name": newName}),
        headers,
    })
    .then((res) => window.location.reload());
}

const addTag = (category) => {
    var newName = prompt(`Enter name of new tag`);
    fetch("/admin/hashtags", {
        method: "POST",
        body: JSON.stringify({ "category": category, "name": newName }),
        headers,
    })
    .then((res) => window.location.reload());
}

const renameCategory = (name) => {
    var newName = prompt(`Enter new name for category "${name}"`);
    fetch("/admin/hashtags/category", {
        method: "POST",
        body: JSON.stringify({ "category": name, "name": newName }),
        headers,
    })
    .then((res) => { window.location.reload(); });
}

const deleteCategory = (name) => {
    fetch("/admin/hashtags/category", {
        method: "DELETE",
        body: JSON.stringify({"category": name}),
        headers,
    })
    .then((res) => window.location.reload());
}

const deleteTag = (id) => {
    fetch("/admin/hashtags/tag", {
      method: "DELETE",
      body: JSON.stringify({"tag": id}),
      headers,
    })
    .then((res) => window.location.reload());
}

const editTag = (id) => {
    var newName = prompt(`Enter new name for tag "${document.getElementById(id).name}"`);
    fetch("/admin/hashtags/tag", {
        method: "POST",
        body: JSON.stringify({ "tag": id, "name": newName }),
        headers,
    })
    .then((res) => window.location.reload());
}