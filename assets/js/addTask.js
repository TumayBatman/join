
/**
 * Sets the selected priority button as active and removes the active class from others.
 *
 * @param {string} selected - The class name of the selected priority button.
 */
function selectPrio(selected) {
  document.querySelectorAll(".prio-btn").forEach((button) => {
    button.classList.remove("active");
  });
  document.querySelector(`.prio-btn.${selected}`).classList.add("active");
  // document.getElementById("selectedPrio").value = selected;
}

/**
 * Initializes event listeners and validations:
 * - Sets the minimum date for the due date and prevents selecting past dates.
 * - Manages subtask input: shows/hides the clear button, toggles the add button, and enables subtask editing.
 * - Validates required fields and enables/disables the "Create Task" button.
 */
document.addEventListener("DOMContentLoaded", function () {
  let dueDateInput = document.getElementById("due-date");
  let today = new Date().toISOString().split("T")[0];
  if (dueDateInput) {
    dueDateInput.setAttribute("min", today);
    dueDateInput.addEventListener("change", function () {
      let selectedDate = new Date(dueDateInput.value);
      let today = new Date();
      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        alert(
          "Das ausgewählte Fälligkeitsdatum darf nicht in der Vergangenheit liegen."
        );
        dueDateInput.value = "";
      }
    });
  }
  let subtaskInput = document.getElementById("subtasks");
  let clearBtn = document.querySelector(".clear-subtask-btn");
  let divider = document.querySelector(".button-divider");
  let addBtn = document.querySelector(".add-subtask-btn");
  let subtaskList = document.getElementById("subtask-list");
  if (subtaskInput) {
    subtaskInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        addSubtask();
      }
    });
    subtaskInput.addEventListener("input", function () {
      if (subtaskInput.value.length > 0) {
        clearBtn.style.display = "block";
        divider.style.display = "block";
        addBtn.innerHTML =
          '<img src="./assets/buttons/check.svg" alt="Checkmark" style="width: 23px; height: 23px;">';
      } else {
        clearBtn.style.display = "none";
        divider.style.display = "none";
        addBtn.innerHTML = "+";
      }
    });
    clearBtn.addEventListener("click", function () {
      subtaskInput.value = "";
      clearBtn.style.display = "none";
      divider.style.display = "none";
      addBtn.innerHTML = "+";
    });
    subtaskList.addEventListener("dblclick", function (event) {
      if (event.target && event.target.classList.contains("subtask-title")) {
        let editButton =
          event.target.parentElement.querySelector(".edit-subtask-btn");
        editSubtask(editButton);
      }
    });
  }
  let formFields = document.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );
  formFields.forEach((field) => {
    field.addEventListener("input", checkRequiredFields);
  });
  checkRequiredFields();
});

/**
 * Adds a new subtask, clears the input field, resets the add button to '+', and hides the clear button and divider.
 */
function addSubtask() {
  let subtaskInput = document.getElementById("subtasks");
  let subtaskValue = subtaskInput.value.trim();
  let addBtn = document.querySelector(".add-subtask-btn");
  let clearBtn = document.querySelector(".clear-subtask-btn");
  let divider = document.querySelector(".button-divider");
  if (subtaskValue) {
    let subtaskList = document.getElementById("subtask-list");
    let listItem = document.createElement("li");
    listItem.classList.add("subtask-item");
    listItem.innerHTML = `
      <span ondbclick="editSubtask(this)" class="subtask-title">${subtaskValue}</span>
      <div class="subtask-actions">
        <button type="button" class="edit-subtask-btn" onclick="editSubtask(this)"><img src="./assets/buttons/edit.svg" alt="Edit" style="width: 16px; height: 16px;"></button>
        <button type="button" class="delete-subtask-btn" onclick="deleteSubtask(this)"><img src="./assets/buttons/delete.svg" alt="Delete" style="width: 16px; height: 16px;"></button>
      </div>
    `;
    subtaskList.appendChild(listItem);
    subtaskInput.value = "";
    addBtn.innerHTML = "+";
    clearBtn.style.display = "none";
    divider.style.display = "none";
  }
}

/**
 * Enables inline subtask editing with an input field.
 * Save changes by clicking the checkmark or pressing Enter.
 *
 * @param {HTMLElement} button - The edit button clicked.
 */
function editSubtask(button) {
  let listItem = button.parentElement.parentElement;
  let subtaskTitle = listItem.querySelector(".subtask-title");
  let inputField = document.createElement("input");
  inputField.type = "text";
  inputField.value = subtaskTitle.textContent;
  inputField.classList.add("edit-input");
  listItem.replaceChild(inputField, subtaskTitle);
  button.style.display = "none";
  let saveBtn = document.createElement("button");
  saveBtn.innerHTML = `
    <img src="./assets/buttons/check.svg" alt="Checkmark" style="width: 20px; height: 20px;">
  `;
  saveBtn.classList.add("save-subtask-btn");
  let actionsContainer = button.parentElement;
  actionsContainer.appendChild(saveBtn);
  saveBtn.addEventListener("click", function () {
    saveSubtaskEdit(listItem, inputField);
    button.style.display = "inline-block";
    saveBtn.remove();
  });
  inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      saveSubtaskEdit(listItem, inputField);
      button.style.display = "inline-block";
      saveBtn.remove();
    }
  });
  inputField.focus();
}

/**
 * Replaces the input field with the updated subtask title if not empty.
 *
 * @param {HTMLElement} listItem - The subtask container.
 * @param {HTMLElement} inputField - The input field with the new title.
 */
function saveSubtaskEdit(listItem, inputField) {
  let newTitle = inputField.value.trim();
  if (newTitle !== "") {
    let newSubtaskTitle = document.createElement("span");
    newSubtaskTitle.classList.add("subtask-title");
    newSubtaskTitle.textContent = newTitle;
    listItem.replaceChild(newSubtaskTitle, inputField);
  }
}

/**
 * Deletes an existing subtask.
 * @param {HTMLElement} button - The button clicked to delete the subtask.
 */
function deleteSubtask(button) {
  let listItem = button.parentElement.parentElement;
  listItem.remove();
}

/**
 * Clears the subtask input field.
 */
function clearSubtaskInput() {
  let subtaskInput = document.getElementById("subtasks");
  subtaskInput.value = "";
}

/**
 * Checks if all required fields are filled and enables/disables the "Create Task" button.
 */
function checkRequiredFields() {
  let requiredFields = document.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );
  let allFilled = true;
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      allFilled = false;
    }
  });
  let createTaskBtn = document.getElementById("createTaskBtn");
  createTaskBtn.disabled = !allFilled;

  // Log-Ausgabe, um den Status des Buttons zu prüfen
  if (allFilled) {
    console.log("Button ist aktiviert");
  } else {
    console.log("Button ist deaktiviert");
  }
}
