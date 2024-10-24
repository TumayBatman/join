/**
 * Renders the sidebar and header content.
 */
function renderSidebarHeader() {
  let sidebarRef = document.getElementById("sidebar");
  sidebarRef.innerHTML = "";
  sidebarRef.innerHTML = getSidebarTemplate();
  let headerRef = document.getElementById("header");
  headerRef.innerHTML = "";
  headerRef.innerHTML = getHeaderTemplate();
}

/**
 * Returns the template for the sidebar.
 * @returns {string} The HTML template for the sidebar.
 */
function getSidebarTemplate() {
  return /*html*/ `
        <div class="logo">
            <img src="./assets/img/JoinLogo.svg" alt="JoinLogo">
        </div>
        <nav>
            <a href="index.html" id="sidebar-nav-summary" class="sidebar-nav-a"><img src="./assets/buttons/Summary.svg" alt="SummaryButton"><span>Summary</span></a>
            <a href="addTask.html" id="sidebar-nav-task" class="sidebar-nav-a"><img src="./assets/buttons/AddTask.svg" alt="AddTask"><span>Add Task</span></a>
            <a href="board.html" id="sidebar-nav-board" class="sidebar-nav-a"><img src="./assets/buttons/Board.svg" alt="Board"><span>Board</span></a>
            <a href="contacts.html" id="sidebar-nav-contacts" class="sidebar-nav-a"><img src="./assets/buttons/Contacts.svg" alt="Contacts"><span>Contacts</span></a>
        </nav>
        <footer>
            <a tabindex="0" href="#">Privacy Policy</a>
            <a tabindex="0" href="#">Legal notice</a>
        </footer>
    `;
}

/**
 * Returns the template for the header.
 * @returns {string} The HTML template for the header.
 */
function getHeaderTemplate() {
  return /*html*/ `
         <div class="header-content">
            <img class="header-responsive-logo" src="./assets/img/JoinLogoResponsive.svg" alt="">
            <h2>Kanban Project Management Tool</h2>
            <div class="user-info">
                <a href="#" class="help-icon"><img src="./assets/buttons/help.svg" alt="Help"></a>
                <div class="user-info-profile" onclick="openHeaderProfileInfo()">SM</div>
            </div>
            <div id="user-info-links" class="user-info-links d-none">
                <p class="user-info-links-help">Help</p>
                <p>Legal Notice</p>
                <p>Privacy Policy</p>
                <p>Log Out</p>
            </div>
        </div>
    `;
}

/**
 * Toggles the visibility of the header profile info dropdown.
 */
function openHeaderProfileInfo() {
  document.getElementById("user-info-links").classList.toggle("d-none");
}

// muss in render-funktion von jeder HTML-Seite aufgerufen werden (bzw. im onload), damit die Nav-Links entsprechend optisch angepasst werden.
// Der Parameter ist die ID des Links, z.B. 'sidebar-nav-board'
/**
 * Updates the active state of the navigation links.
 * @param {string} navLinkID - The ID of the navigation link to activate.
 */
function updateActiveStateNavLink(navLinkID) {
  document
    .querySelectorAll("sidebar-nav-a")
    .forEach((link) => link.classList.remove("nav-a-active"));
  document.getElementById(navLinkID).classList.add("nav-a-active");
}
