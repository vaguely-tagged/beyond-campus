import { category } from "./category.js";

function createCheckboxes(category, categoryOptions, containerId) {
  const categoryContainer = document.createElement("div");
  categoryContainer.id=containerId;
  document.getElementById("options").appendChild(categoryContainer);
  const title = document.createElement("h3");
  title.innerText = category;
  categoryContainer.appendChild(title);
  categoryOptions.forEach((x) => {
    const label = document.createElement("label");
    label.className = "custom-label";

    const checkbox = document.createElement("input");
    checkbox.type="checkbox";
    checkbox.name=category;
    checkbox.value=x.tag_number;
    checkbox.id=x.tag_number;

    const checkboxText = document.createElement("span");
    checkboxText.className="checkbox-text";
    checkboxText.textContent="#"+x.content;
    
    label.appendChild(checkbox);
    label.appendChild(checkboxText);
    categoryContainer.appendChild(label);
  })
}
category.then((data) => {
  Object.keys(data).forEach((x) => createCheckboxes(x,data[x],x))
  console.log("generated");
});