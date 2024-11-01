let taskId;
let taskInformation;
let taskPriority;
let taskCategory;
let assignedUsers;
let selectedUserIds = [];
let isFirstOpen = true;
let editFormErrors = {
  title: 0,
  dueDate: 0,
};

/**
 * Generates the HTML template for displaying detailed information about a task.
 * Also provides buttons for editing and deleting of the task.
 *
 * @returns {string} The HTML string template for the task detail view.
 *
 * @description
 * This template includes:
 * - Task category with color-coded background.
 * - Task title, description, due date, and priority with icon.
 * - Assigned users, each with initials and background color.
 * - List of subtasks with checkboxes indicating completion status.
 * - Edit and delete buttons with confirmation for task deletion.
 */
function taskDetailTemplate() {
  return `
            <div class="task-detail-header">
                <div class="userStory" style="background-color:${
                  taskCategory.color
                }">${taskCategory.title}</div>
                <div class="close-btn-task-detail icon icon-close" onclick="closeTaskDetail()"></div>
            </div>

            <div class="task-detail-body">
                <h1>${taskInformation.title}</h1>
                <p>${taskInformation.description}</p>
                <div class="task-term">
                    <div>
                        <p>Due date:</p>
                        <p>Priority:</p>
                    </div>
                    <div>
                        <p>${taskInformation.date}</p>
                        <div class="detail-priority-container">
                            <span style="margin-right: 8px;">${
                              taskPriority.title
                            }</span>
                            <span class="icon ${
                              taskPriority.icon
                            }" style="color:${taskPriority.color}"></span>
                        </div>
                    </div>
                </div>
                <div class="assigned">
                    <p>Assigned To:</p>
                    <div id="task-overlay-assigned-contacts">
                        ${(assignedUsers || [])
                          .map(
                            (user) => `
                            <div class="contributor-placement">
                                <div class="contributor" style="background-color: ${user.color};">${user.profileImage}</div>
                                <p>${user.name}</p>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                <div class="subtask">
                    <p style="margin-bottom: 10px;">Subtasks</p>
                    <div class="subtask-checkbox">
                    ${
                      taskInformation.subtasks &&
                      taskInformation.subtasks.length > 0
                        ? taskInformation.subtasks
                            .map(
                              (subtask, index) => `
                            <div class="check-subtask" id="subtask-${index}" onclick="toggleSubtask(${index})">
                                <img id="unchecked-${index}" class="checkbox-img ${
                                subtask.done ? "d-none" : ""
                              }" src="./assets/img/unchecked-button.svg" alt="checkbox">
                                <img id="checked-${index}" class="checkbox-tick-img ${
                                subtask.done ? "" : "d-none"
                              }" src="./assets/img/checked-button.svg" alt="checkbox">
                                <span>${subtask.title}</span>
                            </div>
                        `
                            )
                            .join("")
                        : "<p>No subtasks available</p>"
                    }
                        </div>
                </div>
            </div>

            <div class="task-edit-delete" id="task-detail-edit-delete">
                <div class="task-edit-delete-btn" onclick="showDeleteConfirm()">
                    <div class="icon icon-delete"></div>
                    <span>Delete</span>
                </div>
                <div class="task-edit-delete-btn" onclick="openEditTaskForm()">
                    <div class="icon icon-edit"></div>
                    <span>Edit</span>
                </div>
            </div>

            <div class="task-edit-delete confirm-delete d-none" id="task-detail-delete-confirm">
                <div>
                    Are you sure you want delete this task?
                </div>
                <div class="task-edit-delete-btn" onclick="hideDeleteConfirm()">
                    <div class="icon icon-close"></div>
                    <span>No</span>
                </div>
                <div class="task-edit-delete-btn" onclick="confirmDelete()">
                    <div class="icon icon-check"></div>
                    <span>Yes</span>
                </div>
            </div>
            `;
}

/**
 * Generates the HTML template for editing a task, allowing the user to modify
 * the title, description, due date, priority, assignees, and subtasks.
 * Includes validation for required fields and functionality for updating subtasks and assignees.
 *
 * @returns {string} The HTML string template for the task edit view.
 *
 * @description
 * This template includes:
 * - An editable task title with validation.
 * - A description field.
 * - A due date input with placeholder handling and date formatting.
 * - Priority selection buttons, with the currently selected priority highlighted.
 * - An assignees dropdown allowing the selection of contacts.
 * - A subtask input field with clear and add buttons, and a list of existing subtasks.
 * - A confirmation button to submit the edited task details.
 */
function editTaskTemplate() {
  return `
        <div class="edit-task-header">
            <div class="close-btn-task-detail icon icon-close" onclick="closeTaskDetail()"></div>
        </div>

        <form id="edit-task-form" novalidate>
            <div class="form-column edit-task-form-column">
                <label for="title">
                    <div>Title</div>
                    <input type="text" id="title" name="title" placeholder="Enter a title" value="${
                      taskInformation.title
                    }" required>
                    <span class="title-error error d-none"></span>
                </label>

                <label for="description">
                    <div>Description</div>
                    <textarea id="description" name="description" rows="4"
                        placeholder="Enter a Description">${
                          taskInformation.description
                        }</textarea>
                </label>

                <label for="due-date" class="date-label">
                    <div>Due date</div>
                    <input type="text" class="picker text-date" id="due-date" name="due-date" value="${
                      taskInformation.date
                    }" onfocus="clearPlaceholder('#edit-task-form')"
                        onblur="setPlaceholder('#edit-task-form')" onchange="formatDate('#edit-task-form')" required>
                    <span class="due-date-error error d-none"></span>
                </label>

                <label>
                    <div>Priority</div>
                    <div class="prio-options">
                        <div class="prio-btn urgent ${
                          taskPriority.title === "Urgent" ? "active" : ""
                        }" onclick="selectPrio('#edit-task-form', 'urgent', '-O9M0Iky4rEYMLq5JwoZ')">
                            Urgent<span class="icon-urgent"></span>
                        </div>
                        <div class="prio-btn medium ${
                          taskPriority.title === "Medium" ? "active" : ""
                        }"
                            onclick="selectPrio('#edit-task-form', 'medium', '-O9M0Iky4rEYMLq5Jwo_')">
                            Medium<span class="icon-medium"></span>
                        </div>
                        <div class="prio-btn low ${
                          taskPriority.title === "Low" ? "active" : ""
                        }" onclick="selectPrio('#edit-task-form', 'low', '-O9M0IlWMv7MvM-vtcJ-')">
                            Low <span class="icon-low"></span>
                        </div>
                    </div>
                    <input type="hidden" id="selectedPrio" name="prio" value="${
                      taskInformation.priority
                    }">
                </label>

                <label for="assignees" class="assign-label">
                    <div>Assigned to</div>
                    <div>
                        <input type="search" name="assignees" id="assignees"
                            placeholder="Select contacts to assign" onclick="toggleContactDropdown('#edit-task-form')">
                        <div class="assignees-list d-none"></div>
                        <div id="assigned-to" class="assigned-to">
                            ${assignedUsers
                              .map(
                                (user) => `
                                <span id="${user.id}" class="contact-profile-image" style="background-color:${user.color}">${user.profileImage}</span>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                </label>

                <label for="subtasks">
                    <div>Subtasks</div>
                    <div class="subtask-row">
                        <input type="text" id="subtasks" name="subtasks" placeholder="Add new subtask">
                        <div class="subtask-buttons">
                            <span class="clear-subtask-btn icon-close" onclick="clearSubtaskInput('#edit-task-form')"></span>
                            <span class="add-subtask-btn icon-add" onclick="addSubtask('#edit-task-form')"></span>
                        </div>
                    </div>
                    <ul id="subtask-list" class="subtask-list">
                        ${(taskInformation.subtasks || [])
                          .map(
                            (subtask, index) => `
                            <li class="subtask-item">
                                <span class="subtask-dot"></span>
                                <span ondbclick="editSubtask(this)" class="subtask-title" status="${subtask.done}">${subtask.title}</span>
                                <div class="subtask-actions">
                                    <div class="edit-subtask-btn icon-edit" onclick="editSubtask(this)"></div>
                                    <div class="delete-subtask-btn icon-delete" onclick="deleteSubtask(this)"></div>
                                </div>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </label>
            </div>
            <div class="edit-task-confirm-btn">
                <button id="editTaskBtn" type="submit" class="create-task-btn">
                    Ok<span class="icon-check"></span>
                </button>
            </div> 
        </form>                    
    `;
}

/**
 * Fetches task-related data from the database, including task information,
 * priority, category, and assigned users. Logs an error message if any of the data retrieval operations fail.
 *
 * @returns {Promise<void>}
 */
async function getDataFromDatabase() {
  try {
    taskInformation = await getData("tasks/" + taskId);
    taskPriority = await getData("priorities/" + taskInformation.priority);
    taskCategory = await getData("categories/" + taskInformation.category);
    assignedUsers = await getDetailAssignedUsers();
  } catch (error) {
    console.error("Get data failed:");
  }
}

/**
 * Retrieves detailed information for the users assigned to the current task.
 * Iterates over the user IDs in the task information, fetches user data from the database,
 * and returns an array of user details. If no users are assigned, returns an empty array.
 *
 * @returns {Promise<Array>} - An array of user details.
 */
async function getDetailAssignedUsers() {
  if (taskInformation.users != undefined && taskInformation.users.length > 0) {
    const userDetails = [];
    for (const userId of taskInformation.users) {
      const user = await getData("users/" + userId);
      user["id"] = userId;
      userDetails.push(user);
    }
    return userDetails;
  }
  return [];
}

/**
 * Opens the task detail view by setting the task ID, fetching the necessary data from the database,
 * loading the templates, and displaying the task detail overlay. Adds a brief delay before showing
 * the task detail and edit task elements for a smoother transition.
 *
 * @param {string} id - The ID of the task to display the details for.
 * @returns {Promise<void>}
 */
async function openTaskDetail(id) {
  taskId = id;
  await getDataFromDatabase();
  await loadTemplates();
  document.getElementById("overlay").classList.remove("d-none");
  document.getElementById("task-detail").classList.remove("d-none");
  setTimeout(() => {
    document.getElementById("task-detail").classList.add("show");
    document.getElementById("edit-task").classList.add("show");
  }, 100);
}

/**
 * Loads the task detail and edit task templates into their respective HTML elements.
 * Replaces the inner HTML of the task detail and edit task containers with the generated templates.
 *
 * @returns {Promise<void>}
 */
async function loadTemplates() {
  document.getElementById("task-detail").innerHTML = taskDetailTemplate();
  document.getElementById("edit-task").innerHTML = editTaskTemplate();
}

/**
 * Closes the task detail overlay and hides the overlay after a delay.
 */
function closeTaskDetail() {
  document.getElementById("task-detail").classList.remove("show");
  document.getElementById("edit-task").classList.remove("show");
  setTimeout(() => {
    document.getElementById("edit-task").classList.add("d-none");
    document.getElementById("overlay").classList.add("d-none");
  }, 500);
}

/**
 * Displays the delete confirmation section by hiding the edit/delete buttons
 * and showing the delete confirmation prompt in the task detail view.
 */
function showDeleteConfirm() {
  document.getElementById("task-detail-edit-delete").classList.add("d-none");
  document
    .getElementById("task-detail-delete-confirm")
    .classList.remove("d-none");
}

/**
 * Hides the delete confirmation prompt by restoring the edit/delete buttons
 * in the task detail view.
 */
function hideDeleteConfirm() {
  document.getElementById("task-detail-edit-delete").classList.remove("d-none");
  document.getElementById("task-detail-delete-confirm").classList.add("d-none");
}

/**
 * Opens the edit task form by hiding the task detail view and displaying the edit task view.
 * Initializes various form elements including contacts, subtasks, date input, and contact dropdown list.
 * Also sets up the event listeners for the edit task form.
 *
 * @returns {Promise<void>}
 */
async function openEditTaskForm() {
  document.getElementById("task-detail").classList.add("d-none");
  document.getElementById("edit-task").classList.remove("d-none");
  renderContacts("#edit-task-form", taskInformation.users);
  initSubtaskFunctions("#edit-task-form");
  initDateInput("#edit-task-form");
  initContactDropdownList("#edit-task-form");
  editFormEventListener();
}

/**
 * Adds an event listener to the edit task form, handling form submission and
 * validating required fields. If there are no validation errors, it triggers
 * the edit confirmation process.
 */
function editFormEventListener() {
  let formElement = document.getElementById("edit-task-form");
  formElement.addEventListener("submit", handleEditFormSubmit);
}

/**
 * Handles the submit event for the edit task form.
 * Prevents the default form submission behavior, validates the title and due date fields,
 * and proceeds to confirm the edit if the fields are valid (no errors).
 *
 * @param {Event} e - The submit event object.
 * @returns {Promise<void>}
 */
async function handleEditFormSubmit(e) {
  e.preventDefault();
  checkEditFormValidation("title", "The title field is required");
  checkEditFormValidation("due-date", "The Date field is required");
  if (editFormErrors.title === 0 && editFormErrors.dueDate === 0) {
    await confirmEdit();
  }
}

/**
 * Checks the validity of an input field within the edit task form. Displays an error message
 * if the input is invalid or matches a placeholder value, and updates the validation status
 * in `editFormErrors`.
 *
 * @param {string} inputName - The name attribute of the input element to validate.
 * @param {string} message - The error message to display if validation fails.
 */
function checkEditFormValidation(inputName, message) {
  let inputElement = document.querySelector(
    `#edit-task-form *[name = ${inputName}]`
  );
  if (!inputElement.checkValidity()) {
    showInputValidationError("#edit-task-form", inputName, message);
    editFormErrors[inputName] = 1;
  } else {
    hideInputValidationError("#edit-task-form", inputName);
    editFormErrors[inputName] = 0;
  }
  if (inputElement.value === "dd/mm/yyyy") {
    showInputValidationError("#edit-task-form", inputName, message);
    editFormErrors[inputName] = 1;
  }
}

/**
 * Confirms the edit of a task by updating the task data, re-fetching the task details,
 * reloading the templates, and refreshing the task list. Hides the edit task view
 * and shows the updated task detail view.
 *
 * @returns {Promise<void>}
 */
async function confirmEdit() {
  await updateTaskData();
  await getDataFromDatabase();
  await loadTemplates();
  hideEditTaskShowDetailView();
  await loadTasksFromDatabase();
  filterTasks = Object.entries(tasks);
  await renderTasks(
    taskInformation.status + "-tasks",
    getTasksByStatus(taskInformation.status)
  );
}

/**
 * Hides the edit task view and shows the task detail view.
 * Updates the CSS classes of the relevant HTML elements to manage their visibility.
 */
function hideEditTaskShowDetailView() {
  document.getElementById("task-detail").classList.remove("d-none");
  document.getElementById("task-detail").classList.add("show");
  document.getElementById("edit-task").classList.add("d-none");
  document.getElementById("edit-task").classList.add("show");
}

/**
 * Confirms the deletion of a task by removing task data from the database,
 * hiding the task detail and edit views, and updating the task list.
 *
 * @async
 */
async function confirmDelete() {
  await deleteTaskData();
  document.getElementById("task-detail").classList.remove("show");
  document.getElementById("edit-task").classList.remove("show");
  document.getElementById("overlay").classList.add("d-none");
  await loadTasksFromDatabase();
  filterTasks = Object.entries(tasks);
  await renderTasks(
    taskInformation.status + "-tasks",
    getTasksByStatus(taskInformation.status)
  );
}

/**
 * Toggles the completion status of a subtask, updating its visual state and storing the
 * change in the database. Refreshes the task list and the edit task template after updating.
 *
 * @async
 * @param {number} index - The index of the subtask in `taskInformation.subtasks` to toggle.
 */
async function toggleSubtask(index) {
  let subTaskStatus;
  const subtaskElement = document.getElementById(`subtask-${index}`);
  const unchecked = document.getElementById(`unchecked-${index}`);
  const checked = document.getElementById(`checked-${index}`);
  subtaskElement.style.pointerEvents = "none";
  if (taskInformation.subtasks[index].done) {
    subTaskStatus = markSubtaskAsNotDone(index, unchecked, checked);
  } else {
    subTaskStatus = markSubstaskAsDone(index, unchecked, checked);
  }
  await updateTaskDataForSubtaskStatusChange(index, subTaskStatus);
  document.getElementById("edit-task").innerHTML = editTaskTemplate();
  subtaskElement.style.pointerEvents = "auto";
}

/**
 * Marks a subtask as not done by updating its status and adjusting the visibility of the corresponding UI elements.
 *
 * @param {number} index - The index of the subtask in the taskInformation object.
 * @param {boolean} subTaskStatus - The status of the subtask, set to false.
 * @param {Element} unchecked - The HTML element representing the unchecked state of the subtask.
 * @param {Element} checked - The HTML element representing the checked state of the subtask.
 */
function markSubtaskAsNotDone(index, unchecked, checked) {
  taskInformation.subtasks[index].done = false;
  unchecked.classList.remove("d-none");
  checked.classList.add("d-none");
  return false;
}

/**
 * Marks a subtask as done by updating its status and adjusting the visibility of the corresponding UI elements.
 *
 * @param {number} index - The index of the subtask in the taskInformation object.
 * @param {boolean} subTaskStatus - The status of the subtask, set to true.
 * @param {Element} unchecked - The HTML element representing the unchecked state of the subtask.
 * @param {Element} checked - The HTML element representing the checked state of the subtask.
 */
function markSubstaskAsDone(index, unchecked, checked) {
  taskInformation.subtasks[index].done = true;
  unchecked.classList.add("d-none");
  checked.classList.remove("d-none");
  return true;
}

/**
 * Updates the task data in the database to reflect the status change of a subtask.
 * Posts the updated subtask status, reloads the tasks from the database,
 * updates the task list, and re-renders the tasks by their status.
 *
 * @param {number} index - The index of the subtask in the task information.
 * @param {boolean} subTaskStatus - The updated status of the subtask.
 * @returns {Promise<void>}
 */
async function updateTaskDataForSubtaskStatusChange(index, subTaskStatus) {
  await putData(
    "tasks",
    taskId + "/subtasks/" + index + "/done",
    subTaskStatus
  );
  await loadTasksFromDatabase();
  filterTasks = Object.entries(tasks);
  await renderTasks(
    taskInformation.status + "-tasks",
    getTasksByStatus(taskInformation.status)
  );
}

/**
 * Updates the task data in the database with the latest form input values, including title,
 * description, assigned users, due date, priority, category, subtasks, and status.
 * Collects form data, constructs an updated task object, and saves it to the database.
 *
 * @async
 * @throws {Error} Logs an error to the console if updating the task fails.
 */
async function updateTaskData() {
  try {
    const {
      title,
      description,
      users,
      date,
      priority,
      category,
      subtasks,
      status,
    } = gatherTaskFormData();
    const data = createTaskDataObject(
      title,
      description,
      users,
      date,
      priority,
      category,
      subtasks,
      status
    );
    await putData("tasks", taskId, data);
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
  }
}

/**
 * Gathers task data from the edit task form, including title, description, assigned users,
 * due date, priority, category, subtasks, and status.
 *
 * @returns {Object} - An object containing the gathered task data.
 */
function gatherTaskFormData() {
  let title = document.querySelector("#edit-task-form *[name=title]").value;
  let description =
    document.querySelector("#edit-task-form *[name=description]").value || "";
  let assignedSpans = document
    .querySelector("#edit-task-form .assigned-to")
    .querySelectorAll("span");
  let users = Array.from(assignedSpans).map((span) => span.id);
  let date = document.querySelector("#edit-task-form *[name=due-date]").value;
  let priority = document.querySelector("#edit-task-form *[name=prio]").value;
  let category = taskInformation.category;
  let subtasks = Array.from(
    document.querySelector("#edit-task-form .subtask-list").children
  ).map((li) => ({
    done: li.querySelector(".subtask-title").getAttribute("status") == "true",
    title: li.querySelector(".subtask-title").textContent,
  }));
  let status = taskInformation.status;
  return {
    title,
    description,
    users,
    date,
    priority,
    category,
    subtasks,
    status,
  };
}

/**
 * Creates a task data object with the provided task details.
 * Ensures that the users and subtasks arrays are not empty.
 *
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {Array<string>} users - An array of user IDs assigned to the task.
 * @param {string} date - The due date of the task.
 * @param {string} priority - The priority level of the task.
 * @param {string} category - The category of the task.
 * @param {Array<Object>} subtasks - An array of subtask objects.
 * @param {string} status - The status of the task.
 * @returns {Object} - An object containing the task data.
 */
function createTaskDataObject(
  title,
  description,
  users,
  date,
  priority,
  category,
  subtasks,
  status
) {
  return {
    title: title,
    description: description,
    users: users.length > 0 ? users : [],
    date: date,
    priority: priority,
    category: category,
    subtasks: subtasks.length > 0 ? subtasks : [],
    status: status,
  };
}

/**
 * Deletes the task data from the database based on the `taskId`.
 *
 * @async
 */
async function deleteTaskData() {
  await deleteData("tasks", taskId);
}
