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

    const checkboxText = document.createElement("span");
    checkboxText.className = "checkbox-text";
    checkboxText.textContent = "#" + categoryOptions[key]; // Use the key to access the option

    label.appendChild(checkbox);
    label.appendChild(checkboxText);
    categoryContainer.appendChild(label);
  }
}
category.then((data) => {
  console.log(data);
  for (let i = 0; i < data.length; ++i) createCheckboxes(String(i),data[i],String(i));
});

/*
createCheckboxes("personality", category.personality, "personality-options");
createCheckboxes("mbti", category.mbti, "mbti-options");
createCheckboxes(
  "entertainment",
  category.entertainment,
  "entertainment-options"
);
createCheckboxes("game", category.game, "game-options");
createCheckboxes("food", category["food&beverage"], "food-options");
createCheckboxes("drink", category["drink&party"], "drink-options");
createCheckboxes("sports", category["sports"], "sports-options");
createCheckboxes("hobby", category["hobby"], "hobby-options");
createCheckboxes("journey", category["journey"], "journey-options");
createCheckboxes("others", category["others"], "others-options");
*/