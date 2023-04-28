let userDisplayer = async () => {
  const userId = localStorage["currentUser"];
  if (userId === undefined || userId === "") return;
  const response = await fetch(`../api/user/${userId}`);
  const user = await response.json();
  const userDiv = document.createElement("div");
  userDiv.classList = "user";
  const userImage = document.createElement("img");
  userImage.src = "../recourses/icons/user-solid.svg";
  const userName = document.createElement("span");
  userName.innerHTML = `${user.last_name}, ${user.first_name}`;
  const userRole = document.createElement("span");
  userRole.innerHTML = `${user.role}`;
  const arrowDown = document.createElement("img");
  arrowDown.src = "../recourses/icons/angle-down-solid.svg";
  arrowDown.classList = "log-options";
  userDiv.appendChild(userImage);
  userDiv.appendChild(userName);
  userDiv.appendChild(userRole);
  userDiv.appendChild(arrowDown);
  userDiv.addEventListener("click", (e) => {
    userClickHandler(e);
  });
  const nav = document.querySelector("#nav-ul");
  const loginOption = document.querySelector("#nav-ul li:last-child");
  nav.insertBefore(userDiv, loginOption);
  loginOption.remove();
};
const userClickHandler = (event) => {
  if (
    event.target.classList.contains("log-options") &&
    document.querySelector(".logout") === null
  ) {
    const logoutDiv = document.createElement("div");
    logoutDiv.classList = "logout";
    const rect = document.querySelector(".user").getBoundingClientRect();
    logoutDiv.style.top = `${rect.top + rect.height}px`;
    logoutDiv.style.left = `${rect.left - 10}px`;
    const logout = document.createElement("span");
    logout.innerHTML = "Logout";
    const logoutImage = document.createElement("img");
    logoutImage.src = "../recourses/icons/arrow-right-from-bracket-solid.svg";
    logoutDiv.appendChild(logoutImage);
    logoutDiv.appendChild(logout);
    logoutDiv.addEventListener("click", () => {
      localStorage["currentUser"] = "";
      window.location.href = "../login/login.html";
    });
    root.appendChild(logoutDiv);
  } else if (
    event.target.classList.contains("log-options") &&
    document.querySelector(".logout") !== null
  ) {
    document.querySelector(".logout").remove();
  } else if (
    event.target.classList.contains("user") &&
    document.querySelector(".logout") !== null
  ) {
    document.querySelector(".logout").remove();
  } else {
    const userRole = document.querySelector(".user span:last-of-type");
    if (userRole.innerHTML.toLowerCase() === "reviewer") {
      window.location.href = "../Reviewer/reviewer.html";
    } else if (userRole.innerHTML.toLowerCase() === "author") {
      window.location.href = "../Author/author.html";
    } else if (userRole.innerHTML.toLowerCase() === "organizer") {
      window.location.href = "../conference-schedule/confrence-schedule.html";
    }
  }
};

const moveLogOut = () => {
  const logoutDiv = document.querySelector(".logout");
  if (logoutDiv !== null) {
    const rect = document.querySelector(".user").getBoundingClientRect();
    logoutDiv.style.top = `${rect.top + rect.height}px`;
    logoutDiv.style.left = `${rect.left - 10}px`;
  }
};
window.addEventListener("resize", moveLogOut);


const root = document.querySelector(".root");
let clickedEditSvg = null;

window.onload = async () => {
  await userDisplayer();
  const currentConference = localStorage["currentConference"];
  if (typeof currentConference !== "undefined" && currentConference !== "") {
    const response = await fetch(`../api/conference/${currentConference}`);
    const conference = await response.json();
    // if the page is empty show the empty page screen
    if (conference.sessions.length === 0) {
      root.classList += " empty";
      emptyPageScreen();
      return;
    }

    // title filter and add session button
    let title = `<h1>Coference Schedule</h1>`;
    let filter = `<div class="filter"><input type="date"/></div>`;
    root.innerHTML += title;
    root.innerHTML += filter;
    document
      .querySelector(".filter input")
      .addEventListener("change", (e) => filterSessions(e.target.value));

    const addSessionBtn = document.createElement("button");
    addSessionBtn.innerHTML = "+ Add Session";
    addSessionBtn.classList = "add-session-btn";

    document.querySelector(".filter").insertBefore(addSessionBtn, document.querySelector(".filter").firstChild);
    
    // Creating the sessions
    let sessions = conference.sessions;
    await addAllSessions(sessions);

    // trash and edit
    const editSvg = document.createElement("img");
    editSvg.src = "../recourses/icons/pen-to-square-solid.svg";
    editSvg.classList = "edit-svg";

    const trashSvg = document.createElement("img");
    trashSvg.src = "../recourses/icons/trash-solid.svg";
    trashSvg.classList = "trash-svg";

    const h2s = document.querySelectorAll(".session h2");
    h2s.forEach(h2 => {
      h2.appendChild(editSvg.cloneNode(true))
      h2.appendChild(trashSvg.cloneNode(true))
  });
  
  // The pop up
  const editPopUp = document.createElement("div");
  editPopUp.classList = "edit-pop-up";

  // The overlay
  const editPopUpOverlay = document.createElement("div");
  editPopUpOverlay.classList = "overlay";

  // Accepted Papers h2
  const editPopUpTitle = document.createElement("h2");
  editPopUpTitle.innerHTML = "Accepted Papers";
  editPopUpTitle.classList = "edit-pop-up-title";

  // Accepted Papers h2 container
  const editPopUpTitleContainer = document.createElement("div");
  editPopUpTitleContainer.classList = "edit-pop-up-title-container";
  editPopUpTitleContainer.appendChild(editPopUpTitle);
  editPopUp.appendChild(editPopUpTitleContainer);
  
  // Accepted Papers container
  const editPopUpPapersContainer = document.createElement("div");
  editPopUpPapersContainer.classList = "edit-pop-up-papers-container";
  editPopUp.appendChild(editPopUpPapersContainer);

  // Test

  // let counter = 0;
  // while (counter < 11) {
  //   let checkbox = document.createElement("input");
  //   checkbox.type = "checkbox";
  //   checkbox.name = "paper";
  //   checkbox.value = "paper";
  //   checkbox.classList = "edit-pop-up-paper-checkbox";
  //   editPopUpPapersContainer.appendChild(checkbox);
  //   counter++;
  // }
 
  // Session details h2
  const editPopUpTitle2 = document.createElement("h2");
  editPopUpTitle2.innerHTML = "Session Details";
  editPopUpTitle2.classList = "edit-pop-up-title2";

  // Session details h2 container
  const editPopUpTitle2Container = document.createElement("div");
  editPopUpTitle2Container.classList = "edit-pop-up-title2-container";
  editPopUpTitle2Container.appendChild(editPopUpTitle2);
  editPopUp.appendChild(editPopUpTitle2Container);

  // Session details container
  const editPopUpSessionDetailsContainer = document.createElement("div");
  editPopUpSessionDetailsContainer.classList = "edit-pop-up-session-details-container";
  editPopUp.appendChild(editPopUpSessionDetailsContainer);

  // Presenter container
  const editPopUpPresenterContainer = document.createElement("div");
  editPopUpPresenterContainer.classList = "edit-pop-up-presenter-container";
  editPopUpSessionDetailsContainer.appendChild(editPopUpPresenterContainer);

  // Presenter label
  const editPopUpPresenterLabel = document.createElement("label");
  editPopUpPresenterLabel.innerText = "Select Presenter:";
  editPopUpPresenterLabel.classList = "edit-pop-up-presenter-label";
  editPopUpPresenterContainer.appendChild(editPopUpPresenterLabel);

  // Presenter select
  const editPopUpPresenterSelect = document.createElement("select");
  editPopUpPresenterSelect.classList = "edit-pop-up-presenter-select";
  editPopUpPresenterContainer.appendChild(editPopUpPresenterSelect);

  // Date container
  const editPopUpDateContainer = document.createElement("div");
  editPopUpDateContainer.classList = "edit-pop-up-date-container";
  editPopUpSessionDetailsContainer.appendChild(editPopUpDateContainer);

  // Date label
  const editPopUpDateLabel = document.createElement("label");
  editPopUpDateLabel.innerText = "Select Date:";
  editPopUpDateLabel.classList = "edit-pop-up-date-label";
  editPopUpDateContainer.appendChild(editPopUpDateLabel);

  // Date select
  const editPopUpDateInput = document.createElement("select");
  editPopUpDateInput.classList = "edit-pop-up-date-select";
  editPopUpDateContainer.appendChild(editPopUpDateInput);

  editPopUpSessionDetailsContainer.appendChild(editPopUpDateContainer);

  // Location container
  const editPopUpLocationContainer = document.createElement("div");
  editPopUpLocationContainer.classList = "edit-pop-up-location-container";
  editPopUpSessionDetailsContainer.appendChild(editPopUpLocationContainer);

  // Location label
  const editPopUpLocationLabel = document.createElement("label");
  editPopUpLocationLabel.innerText = "Select Location:";
  editPopUpLocationLabel.classList = "edit-pop-up-location-label";
  editPopUpLocationContainer.appendChild(editPopUpLocationLabel);


  // Location select
  const editPopUpLocationSelect = document.createElement("select");
  editPopUpLocationSelect.classList = "edit-pop-up-location-select";
  editPopUpLocationContainer.appendChild(editPopUpLocationSelect);

  editPopUpSessionDetailsContainer.appendChild(editPopUpLocationContainer);
  
  // Buttons container
  const editPopUpButtonsContainer = document.createElement("div");
  editPopUpButtonsContainer.classList = "edit-pop-up-buttons-container";
  editPopUp.appendChild(editPopUpButtonsContainer);

  // Cancel button
  const editPopUpCancelButton = document.createElement("button");
  editPopUpCancelButton.innerText = "Cancel";
  editPopUpCancelButton.classList = "edit-pop-up-cancel-button";
  editPopUpButtonsContainer.appendChild(editPopUpCancelButton);

  // Submit button
  const editPopUpSubmitButton = document.createElement("button");
  editPopUpSubmitButton.innerText = "Submit";
  editPopUpSubmitButton.classList = "edit-pop-up-submit-button";
  editPopUpButtonsContainer.appendChild(editPopUpSubmitButton);

  root.appendChild(editPopUpOverlay);
  root.appendChild(editPopUp);

  // Event listeners

  // Open pop up
  const editSvgs = document.querySelectorAll(".edit-svg");
  editSvgs.forEach(svg=> {
      svg.addEventListener("click", async (e) => {
        clickedEditSvg = e.target;
        await handleEdit();
      });
  });
  
  // Close pop up
  editPopUpOverlay.addEventListener("click", handleHide);
  editPopUp.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  editPopUpCancelButton.addEventListener("click", handleHide);

  // Submit pop up
  editPopUpSubmitButton.addEventListener("click", e => {
    e.preventDefault();
    readInputs(e);
  });

  } else {
    root.classList += " empty";
    emptyPageScreen();
  }
};



function handleHide() {
  let editPopUp = document.querySelector(".edit-pop-up");
  let editPopUpOverlay = document.querySelector(".overlay");
  let editPopUpPapersContainer = document.querySelector(".edit-pop-up-papers-container");
  let presenterSelect = document.querySelector(".edit-pop-up-presenter-select");
  let dateSelect = document.querySelector(".edit-pop-up-date-select");
  let locationSelect = document.querySelector(".edit-pop-up-location-select");


  editPopUp.style.display = "none";
  editPopUpOverlay.style.display = "none";

  while (editPopUpPapersContainer.firstChild) {
    editPopUpPapersContainer.removeChild(editPopUpPapersContainer.firstChild);
  }

  while (presenterSelect.firstChild) {
    presenterSelect.removeChild(presenterSelect.firstChild);
  }

  while (dateSelect.firstChild) {
    dateSelect.removeChild(dateSelect.firstChild);
  }

  while (locationSelect.firstChild) {
    locationSelect.removeChild(locationSelect.firstChild);
  }

}

function readInputs() {
  
  let editPopUp = document.querySelector(".edit-pop-up");
  let editPopUpOverlay = document.querySelector(".overlay");
  let editPopUpPapersContainer = document.querySelector(".edit-pop-up-papers-container");
  let presenterSelect = document.querySelector(".edit-pop-up-presenter-select");
  let dateSelect = document.querySelector(".edit-pop-up-date-select");
  let locationSelect = document.querySelector(".edit-pop-up-location-select");

  let selectedPapers = [];
  let selectedPresenter = presenterSelect.value;
  let selectedDate = dateSelect.value;
  let selectedLocation = locationSelect.value;

  // Get all selected papers
  let checkboxes = document.querySelectorAll(".edit-pop-up-paper-checkbox");
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedPapers.push(checkbox.value);
    }
  });

  let state = {
    papers: selectedPapers,
    presenter: selectedPresenter,
    date: selectedDate,
    location: selectedLocation,
  };
  
  return state;

}

// function updateSession(e) {
//   let state = readInputs(e);
  
// }


async function handleEdit() {
  let editPopUp = document.querySelector(".edit-pop-up");
  let editPopUpOverlay = document.querySelector(".overlay");
  let editPopUpPapersContainer = document.querySelector(".edit-pop-up-papers-container");
  let presenterSelect = document.querySelector(".edit-pop-up-presenter-select");
  let dateSelect = document.querySelector(".edit-pop-up-date-select");
  let locationSelect = document.querySelector(".edit-pop-up-location-select");

  editPopUp.style.display = "block";
  editPopUpOverlay.style.display = "block";

  let papers = await getAllPapers();
  

  papers.forEach(async (paper) => {
    // Filling the pop up with papers
    let container = document.createElement("div");
    container.classList = "edit-pop-up-paper-container";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = paper.id;
    checkbox.classList = "edit-pop-up-paper-checkbox";

    let label = document.createElement("label");
    label.innerText = paper.title;
    label.classList = "edit-pop-up-paper-label";

    container.appendChild(checkbox);
    container.appendChild(label);
    editPopUpPapersContainer.appendChild(container);

    // Filling the presenter select
    let mainAuthor = paper.authors.filter((author) => author.main === true)[0];
    let option = document.createElement("option");
    // Fetch mainAuthor name
    let response = await fetch(`../api/user/${mainAuthor.id}`);
    let data = await response.json();

    option.value = data.id;
    option.innerText = data.first_name + " " + data.last_name;
    presenterSelect.appendChild(option);
  });

  // Filling the date select
  let dates = await fetch(`../api/date`);
  dates = await dates.json();
  dates.forEach((date) => {
    let option = document.createElement("option");
    option.value = date;
    option.innerText = formatDate(date);
    dateSelect.appendChild(option);
  });

  // Filling the location select
  let locations = await fetch(`../api/location`);
  locations = await locations.json();
  locations.forEach((location) => {
    let option = document.createElement("option");
    option.value = location;
    option.innerText = location;
    locationSelect.appendChild(option);
  });
}

async function getAllPapers() {
  let papers = await fetch(`../api/paper`);
  papers = await papers.json();
  papers = papers.filter((e) => e.status === true);

  let conferences = await fetch(`../api/conference`);
  conferences = await conferences.json();
  let sessions = conferences.map((e) => e.sessions).flat();
  // If the paper is already in a session, remove it from the papers array
  // get all the papers in the sessions then loop to remove them
  let papersInSessions = sessions.map((e) => e.papers).flat();
  papersInSessions.map((e) => {
    papers = papers.filter((paper) => paper.id !== e);
  });
  return papers;
}

let currentLoaddedSessionIndex = 0;

function formatDate(d) {
  let date = new Date(Date.parse(d));
  let dateView = date.toDateString();
  dateView = dateView.split(" ");
  dateView.shift();
  dateView = dateView.join(" ");
  return dateView;
}

let emptyPageScreen = () => {
  let container = document.createElement("div");
  let mainImage = document.createElement("img");
  mainImage.src = "../recourses/Group 26649.svg";
  let text = document.createElement("p");
  text.innerHTML = "This page seems to be empty";
  container.classList += "empty-container";
  container.appendChild(mainImage);
  container.appendChild(text);
  root.appendChild(container);
};

let createSession = async (session) => {
  // let date = new Date(Date.parse(session.day));
  // let dateView = date.toDateString();
  // dateView = dateView.split(" ");
  // dateView.shift();
  // dateView = dateView.join(" ");
  let dateView = formatDate(session.day);

  let container = document.createElement("div");
  container.classList = "session";
  //return an array of paper objects
  let papers = await Promise.all(
    session.papers.map(async (e) => await paperFinder(e))
  );
  let partitions = "";
  papers.map((e) => {
    let partition = `<div class="paper"><span>&#183;   ${e.title}<span></div>`;
    partitions += partition;
  });
  let content = `<h2>${dateView} - ${session.location}</h2>`;
  container.innerHTML = content;
  container.innerHTML += partitions;
  return container;
};

let paperFinder = async (paperId) => {
  const response = await fetch(`../api/paper/${paperId}`);
  const paper = await response.json();
  return paper;
};

let reset = () => {
  root.style.height = null;
  document
    .querySelectorAll(".session")
    .forEach((e) => (e.style.display = "none"));
};
const filterSessions = (date) => {
  if (date === "") {
    root.style.height = "auto";
    document
      .querySelectorAll(".session")
      .forEach((e) => (e.style.display = "block"));
    return;
  }
  reset();
  let sessions = document.querySelectorAll(".session");
  sessions.forEach((e) => {
    let sessionDate = e.querySelector("h2").innerHTML.split("-");
    sessionDate = sessionDate[0];
    if (matchesFilter(date, sessionDate)) {
      e.style.display = "block";
    }
  });
};
const matchesFilter = (inputDate1, sessionDate1) => {
  // change both dates to unix time and compare them
  let sessionDate = new Date(Date.parse(sessionDate1));
  let inputDate = new Date(Date.parse(inputDate1));
  // reset the hours minutes and seconds to 0 in the input date
  inputDate.setHours(0, 0, 0, 0);
  if (sessionDate.getTime() === inputDate.getTime()) {
    return true;
  }
  return false;
};

let addAllSessions = async (sessions) => {
  let sesionCount = 0;
  while (sesionCount <= 3) {
    if (sessions.length <= currentLoaddedSessionIndex) break;
    document
      .querySelector(".root")
      .appendChild(await createSession(sessions[currentLoaddedSessionIndex++]));
    if (
      matchesFilter(
        document.querySelector(".filter input").value,
        sessions[currentLoaddedSessionIndex - 1].day
      )
    ) {
      sesionCount++;
    }
  }
  // if (currentLoaddedSessionIndex >= sessions.length) {
  //   document.querySelector(".more-button").style.display = "none";
  // }
};
const displayMoreButton = () => {
  let moreButton = document.createElement("button");
  moreButton.innerHTML = "Load More";
  moreButton.classList = "more-button";
  moreButton.addEventListener("click", () => {

  });
  return moreButton;
};


