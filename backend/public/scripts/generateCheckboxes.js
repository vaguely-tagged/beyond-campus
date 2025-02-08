import { category } from "./category.js";

function createCheckboxes(category, categoryOptions, containerId) {
  const categoryContainer = document.createElement("div");
  categoryContainer.id=containerId;
  document.getElementById("options").appendChild(categoryContainer);

  const keys = Object.keys(categoryOptions); // Get an array of keys

  for (const key of keys) {
    const label = document.createElement("label");
    label.className = "custom-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = category;
    checkbox.value = key; // Set the value to the key
    checkbox.id = key;

    const checkboxText = document.createElement("span");
    checkboxText.className = "checkbox-text";
    checkboxText.textContent = "#" + categoryOptions[key]; // Use the key to access the option

    label.appendChild(checkbox);
    label.appendChild(checkboxText);
    categoryContainer.appendChild(label);
  }
}
category.then((data) => {
  for (let i = 0; i < data.length; ++i) createCheckboxes(String(i),data[i],String(i));
});