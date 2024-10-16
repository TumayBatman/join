/**
 * Checks if an email already exists in the users database.
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>} True if the email exists, false otherwise.
 */
async function isEmailExist(email) {
  const users = await getData("users");

  if (users === null || users === undefined) {
    return false;
  }

  const foundUsers = Object.values(users).filter(
    (user) => user.email === email
  );

  return foundUsers.length > 0 ? true : false;
}

/**
 * Returns a random color from a predefined set of colors.
 * @returns {string} A random color.
 */
function getRandomColor() {
  const colors = [
    "#FF7A00",
    "#FF5EB3",
    "#6E52FF",
    "#9327FF",
    "#00BEE8",
    "#1FD7C1",
    "#FF745E",
    "#FFA35E",
    "#FC71FF",
    "#FFC701",
    "#0038FF",
    "#C3FF2B",
    "#FFE62B",
    "#FF4646",
    "#FFBB2B",
  ];

  const rndInt = randomIntFromInterval(0, colors.length - 1);
  return colors[rndInt];
}

/**
 * Generates a profile image string based on a user's name.
 * @param {string} name - The user's name.
 * @returns {string} The profile image string.
 */
function getProfileImage(name) {
  const parts = name.trim().split(" ");
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial =
    parts.length < 2
      ? parts[0].charAt(0).toUpperCase()
      : parts[1].charAt(0).toUpperCase();
  return firstInitial + lastInitial;
}

/**
 * Returns a random integer between the specified min and max values, inclusive.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random integer between min and max.
 */
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Entfernt alle Fehlerzustände und versteckt Fehlermeldungen
 * in den Formularen "create-contact-form" und "edit-contact-form".
 */
function removeAllErrors() {
  let createInputElements = document.querySelectorAll(
    `#create-contact-form input`
  );
  createInputElements.forEach((element) => {
    element.classList.remove("input-error");
  });

  let editInputElements = document.querySelectorAll(`#edit-contact-form input`);
  editInputElements.forEach((element) => {
    element.classList.remove("input-error");
  });

  let createErrorMessageElements = document.querySelectorAll(
    "#create-contact-form [class$='-error']"
  );
  createErrorMessageElements.forEach((element) => {
    element.classList.add("d-none");
  });

  let editErrorMessageElements = document.querySelectorAll(
    "#edit-contact-form [class$='-error']"
  );
  editErrorMessageElements.forEach((element) => {
    element.classList.add("d-none");
  });
}

/**
 * Zeigt einen Validierungsfehler für ein Eingabefeld an.
 * Fügt der Eingabe die Klasse "input-error" hinzu und zeigt die Fehlermeldung an.
 *
 * @param {string} form - Das Formular, in dem sich das Eingabefeld befindet.
 * @param {string} inputName - Der Name des Eingabefelds.
 * @param {string} message - Die anzuzeigende Fehlermeldung.
 */
function showInputValidationError(form, inputName, message) {
  let inputElement = document.querySelector(
    `${form} input[name = ${inputName}]`
  );
  let errorMessageElement = document.querySelector(
    `${form} .${inputName}-error`
  );

  inputElement.classList.add("input-error");
  errorMessageElement.innerHTML = message;
  errorMessageElement.classList.remove("d-none");
}

/**
 * Versteckt den Validierungsfehler eines Eingabefelds.
 * Entfernt die Fehlerklasse und versteckt die zugehörige Fehlermeldung.
 *
 * @param {string} form - Das Formular, in dem sich das Eingabefeld befindet.
 * @param {string} inputName - Der Name des Eingabefelds.
 */
function hideInputValidationError(form, inputName) {
  let inputElement = document.querySelector(
    `${form} input[name = ${inputName}]`
  );
  let errorMessageElement = document.querySelector(
    `${form} .${inputName}-error`
  );

  inputElement.classList.remove("input-error");
  errorMessageElement.innerHTML = "";
  errorMessageElement.classList.add("d-none");
}

/**
 * Displays a notification message and hides it after a short delay.
 * 
 * @param {string} message - The message to be displayed in the notification.
 */
function showNotification(message) {
  let notificationRef = document.getElementById("notification");
  notificationRef.style.transform = "translateX(2000px)"; 
  setTimeout(() => {
    notificationRef.innerHTML = message;
    notificationRef.style.transform = "translateX(0)";
    setTimeout(() => {
      notificationRef.style.transform = "translateX(2000px)";
    }, 2000);
  }, 50); 
}