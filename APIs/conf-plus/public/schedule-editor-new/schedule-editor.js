let currentSessionId = -1;
let type = "";

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
  if (user.author.length > 0)
      userRole.innerHTML = `Author`;
    else if (user.reviewer.length > 0)
      userRole.innerHTML = `Reviewer`;
    else if (user.organizer.length > 0)
      userRole.innerHTML = `Organizer`;
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
      window.location.href = "../Author/author-home/author-home.html";
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
  const currentConference = JSON.parse(localStorage.getItem("currentConference"));
  if (typeof currentConference === undefined || currentConference === "") 
    window.location.href = "../homepage/index.html";
  
  // title filter and add session button
  let title = `<h1>Conference Schedule</h1>`;
  let filter = `<div class="filter"><input type="date"/></div>`;
  root.innerHTML += title;
  root.innerHTML += filter;
  document
    .querySelector(".filter input")
    .addEventListener("change", (e) => filterSessions(e.target.value));

  const addSessionBtn = document.createElement("button");
  addSessionBtn.innerHTML = "+ Add Session";
  addSessionBtn.classList = "add-session-btn";

  document
    .querySelector(".filter")
    .insertBefore(
      addSessionBtn,
      document.querySelector(".filter").firstChild
    );

  // Creating the sessions
  let sessions = currentConference.session;
  await addAllSessions(sessions);
  
  // trash and edit
  const editSvg = document.createElement("img");
  editSvg.src = "../recourses/icons/pen-to-square-solid.svg";
  editSvg.classList = "edit-svg";

  const trashSvg = document.createElement("img");
  trashSvg.src = "../recourses/icons/trash-solid.svg";
  trashSvg.classList = "trash-svg";

  const h2s = document.querySelectorAll(".session h2");
  h2s.forEach((h2) => {
    h2.appendChild(editSvg.cloneNode(true));
    h2.appendChild(trashSvg.cloneNode(true));
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
  editPopUpSessionDetailsContainer.classList =
    "edit-pop-up-session-details-container";
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
  editPopUpPresenterSelect.id = 'edit-pop-up-presenter-select';
  editPopUpPresenterSelect.multiple = true;
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

  // Time container
  const editPopUpTimeContainer = document.createElement("div");
  editPopUpTimeContainer.classList = "edit-pop-up-time-container";
  editPopUpSessionDetailsContainer.appendChild(editPopUpTimeContainer);

  // From Time label
  const editPopUpFromTimeLabel = document.createElement("label");
  editPopUpFromTimeLabel.innerText = "Select From Time:";
  editPopUpFromTimeLabel.classList = "edit-pop-up-from-time-label";
  editPopUpTimeContainer.appendChild(editPopUpFromTimeLabel);

  // From Time input
  const editPopUpFromTimeInput = document.createElement("input");
  editPopUpFromTimeInput.classList = "edit-pop-up-from-time-input";
  editPopUpFromTimeInput.type = "time";
  editPopUpTimeContainer.appendChild(editPopUpFromTimeInput);

  // To Time label
  const editPopUpToTimeLabel = document.createElement("label");
  editPopUpToTimeLabel.innerText = "Select To Time:";
  editPopUpToTimeLabel.classList = "edit-pop-up-to-time-label";
  editPopUpTimeContainer.appendChild(editPopUpToTimeLabel);

  // To Time input
  const editPopUpToTimeInput = document.createElement("input");
  editPopUpToTimeInput.classList = "edit-pop-up-to-time-input";
  editPopUpToTimeInput.type = "time";
  editPopUpTimeContainer.appendChild(editPopUpToTimeInput);

  editPopUpSessionDetailsContainer.appendChild(editPopUpTimeContainer);

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

    // Add session
    addSessionBtn.addEventListener("click", async (e) => {
      type = "add";
      await handleAddSession();
  });

  // Open pop up
  const editSvgs = document.querySelectorAll(".edit-svg");
  editSvgs.forEach((svg) => {
    svg.addEventListener("click", async (e) => {
      const sessionId = e.target.parentNode.parentNode.id;
      type = "edit";
      await handleEdit(sessionId);
    });
  });

  // Close pop up
  editPopUpOverlay.addEventListener("click", handleHide);
  editPopUp.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  
  editPopUpCancelButton.addEventListener("click", handleHide);

  // Delete session
  const deleteSvgs = document.querySelectorAll(".trash-svg");
  deleteSvgs.forEach(svg => {
    svg.addEventListener("click", async (e) => await handleDelete(e))
  });

  editPopUpSubmitButton.addEventListener("click", async (e) => {
    if(type === "edit"){
      await updateSession();
    } else { 
      await addNewSession();
    }
  });
};

async function handleDelete(e) {
  const clickedDeleteSvg = e.target;
  const sessionId = clickedDeleteSvg.parentNode.parentNode.id;
  const conference = JSON.parse(localStorage.getItem("currentConference"));
  await fetch(`/api/conference/${conference.conference_id}/${sessionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  })
  root.removeChild(clickedDeleteSvg.parentNode.parentNode);
  const response = await fetch(`/api/conference/${conference.conference_id}`);
  const newConference = await response.json();
  localStorage.setItem("currentConference", JSON.stringify(newConference));
  window.location.reload();
}


function handleHide() {
  let editPopUp = document.querySelector(".edit-pop-up");
  let editPopUpOverlay = document.querySelector(".overlay");
  let editPopUpPapersContainer = document.querySelector(
    ".edit-pop-up-papers-container"
  );
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
  const sessionId = currentSessionId;
  let presenterSelect = document.querySelector(".edit-pop-up-presenter-select");
  let dateSelect = document.querySelector(".edit-pop-up-date-select");
  let locationSelect = document.querySelector(".edit-pop-up-location-select");
  let editPopUpFromTimeInput = document.querySelector(".edit-pop-up-from-time-input");
  let editPopUpToTimeInput = document.querySelector(".edit-pop-up-to-time-input");
  let checkBoxes = document.querySelectorAll(".edit-pop-up-paper-checkbox");

  let selectedPaperIDs = [];
  checkBoxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedPaperIDs.push(checkbox.value);
    }
  });

  let selectedPresenter = presenterSelect.value;
  let selectedDate = dateSelect.value;
  let selectedLocation = locationSelect.value;
  let selectedFromTime = editPopUpFromTimeInput.value;
  let selectedToTime = editPopUpToTimeInput.value;
  let conferenceId = JSON.parse(localStorage.getItem("currentConference")).conference_id;
  // If from time is after to time prevent submit
  if (selectedFromTime !== "" && selectedToTime !== "") {
    if (selectedFromTime > selectedToTime) {
      alert("From time must be before to time");
      return false;
    }
  }

  // If no papers selected prevent submit
  if (selectedPaperIDs.length == 0 || selectedDate == "" || selectedLocation == "" || selectedFromTime == "" || selectedToTime == "") {
    alert("Please fill all fields");
    return false;
  }

  let sessionState = {
    session_id: parseInt(sessionId),
    conference_id: parseInt(conferenceId),
    day: selectedDate,
    from_time: selectedFromTime,
    to_time: selectedToTime,
    location_city: selectedLocation,
  };

  let presentationsState = [];
  selectedPaperIDs.forEach((paperId) => {
    presentationsState.push({
      paper_id: parseInt(paperId),
      session_id: parseInt(sessionId),
    });
  });
  return {sessionState, presentationsState};
}

async function handleEdit(sessionId) {
  currentSessionId = sessionId
  const allSessions = JSON.parse(localStorage.getItem("currentConference")).session;

  const thisSession = allSessions.find(session => session.session_id === parseInt(currentSessionId));

  const thisSessionPapers = thisSession.presentation.map(presentation => presentation.paper_id);

  let allUsedPaperIDs = allSessions.map(session => session.presentation.map(presentation => presentation.paper_id)).flat();

  allUsedPaperIDs = allUsedPaperIDs.filter(paper => ! thisSessionPapers.includes(paper) );

  const { papers_presenters } = await fetch("/api/paper/accepted").then(res => res.json())
  const allDates = await fetch("/api/date").then(res => res.json());
  const allLocations = await fetch("/api/location").then(res => res.json()).then(data => data.map(location => location.city));

  let editPopUp = document.querySelector(".edit-pop-up");
  let editPopUpOverlay = document.querySelector(".overlay");
  let editPopUpPapersContainer = document.querySelector(".edit-pop-up-papers-container");
  let presenterSelect = document.querySelector(".edit-pop-up-presenter-select");
  let dateSelect = document.querySelector(".edit-pop-up-date-select");
  let locationSelect = document.querySelector(".edit-pop-up-location-select");
  let fromTimeInput = document.querySelector(".edit-pop-up-from-time-input");
  let toTimeInput = document.querySelector(".edit-pop-up-to-time-input");


  // Filling the date select
  allDates.forEach((date) => {
    let option = document.createElement("option");
    option.value = date.day;
    
    option.innerText = formatDate(date.day);
    dateSelect.appendChild(option);
  });

  // Filling the location select
  allLocations.forEach((location) => {
    let option = document.createElement("option");
    option.value = location;
    option.innerText = location;
    locationSelect.appendChild(option);
  });

  papers_presenters.forEach(async (paper_presenter) => {
    // Check if the paper is already in other sessions
    if (!allUsedPaperIDs.includes(paper_presenter.paper.paper_id)) {
      // Papers container
      let container = document.createElement("div");
      container.classList = "edit-pop-up-paper-container";

      // Checkbox and label
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = paper_presenter.paper.paper_id;
      checkbox.classList = "edit-pop-up-paper-checkbox";
      let label = document.createElement("label");
      label.innerText = paper_presenter.paper.title;
      label.classList = "edit-pop-up-paper-label";
      container.appendChild(checkbox);
      container.appendChild(label);

      // Append Papers container
      editPopUpPapersContainer.appendChild(container);

      // Filling the presenter select
      let option = document.createElement("option");
      option.value = paper_presenter.author.user_id;
      const user = await fetch(`/api/user/${paper_presenter.author.user_id}`).then(res => res.json())
      const fullName = `${user.first_name} ${user.last_name}`;
      option.innerText = fullName;
      presenterSelect.appendChild(option);

      // If paper in this session check it
      if (thisSessionPapers.includes(paper_presenter.paper.paper_id)) {
        checkbox.checked = true;
      }

      }

      
  });

  const session = allSessions.find(session => session.session_id === parseInt(sessionId));
  const sessionDay = session.day;
  const sessionLocation = session.location_city;
  const sessionFromTime = session.from_time;
  const sessionToTime = session.to_time;

  dateSelect.querySelectorAll("option").forEach((option) => {
    if (option.value === sessionDay) 
      option.selected = true;
  });

  locationSelect.querySelectorAll("option").forEach((option) => {
    if (option.value === sessionLocation)
      option.selected = true;
  });

  fromTimeInput.value = sessionFromTime;
  toTimeInput.value = sessionToTime;

      // Show the overlay and the pop up
      editPopUp.style.display = "block";
      editPopUpOverlay.style.display = "block";

}


async function handleAddSession() {
  const allSessions = JSON.parse(localStorage.getItem("currentConference")).session;
  let allUsedPaperIDs = allSessions.map(session => session.presentation.map(presentation => presentation.paper_id)).flat();

  const { papers_presenters } = await fetch("/api/paper/accepted").then(res => res.json())
  const allDates = await fetch("/api/date").then(res => res.json());
  const allLocations = await fetch("/api/location").then(res => res.json()).then(data => data.map(location => location.city));

  let editPopUp = document.querySelector(".edit-pop-up");
  let editPopUpOverlay = document.querySelector(".overlay");
  let editPopUpPapersContainer = document.querySelector(".edit-pop-up-papers-container");
  let presenterSelect = document.querySelector(".edit-pop-up-presenter-select");
  let dateSelect = document.querySelector(".edit-pop-up-date-select");
  let locationSelect = document.querySelector(".edit-pop-up-location-select");
  
  // Filling the date select
  allDates.forEach((date) => {
    let option = document.createElement("option");
    option.value = date.day;
    
    option.innerText = formatDate(date.day);
    dateSelect.appendChild(option);
  });

  // Filling the location select
  allLocations.forEach((location) => {
    let option = document.createElement("option");
    option.value = location;
    option.innerText = location;
    locationSelect.appendChild(option);
  });

  papers_presenters.forEach(async (paper_presenter) => {
    // Check if the paper is already in other sessions
    if (!allUsedPaperIDs.includes(paper_presenter.paper.paper_id)) {
      // Papers container
      let container = document.createElement("div");
      container.classList = "edit-pop-up-paper-container";

      // Checkbox and label
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = paper_presenter.paper.paper_id;
      checkbox.classList = "edit-pop-up-paper-checkbox";
      let label = document.createElement("label");
      label.innerText = paper_presenter.paper.title;
      label.classList = "edit-pop-up-paper-label";
      container.appendChild(checkbox);
      container.appendChild(label);

      // Append Papers container
      editPopUpPapersContainer.appendChild(container);

      // Filling the presenter select
      let option = document.createElement("option");
      option.value = paper_presenter.author.user_id;
      const user = await fetch(`/api/user/${paper_presenter.author.user_id}`).then(res => res.json())
      const fullName = `${user.first_name} ${user.last_name}`;
      option.innerText = fullName;
      presenterSelect.appendChild(option);
      }
  });
      // Show the overlay and the pop up
      editPopUp.style.display = "block";
      editPopUpOverlay.style.display = "block";
}

async function addNewSession() {
  let {sessionState, presentationsState} = readInputs();
  if (sessionState === false || presentationsState === false) {
    handleHide();
    return;
  }

  
  // Send to Database
  await submitToAPInewSession(sessionState, presentationsState);
  
  // Update the session in the DOM
  updateDOM();
  
  handleHide();
  // window.location.reload();
}

async function submitToAPInewSession(sessionState, presentationsState) {
  const newSession = await fetch(`/api/conference/${sessionState.conference_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sessionState),
  }).then((res) => res.json());

  presentationsState = presentationsState.map(presentation => {return {
    "paper_id": presentation.paper_id,
    "session_id": newSession.session_id,
   }
  });

  // Add new presentations
  await fetch(`/api/presentation/${newSession.session_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(presentationsState),
  });

  const updatedConference = await fetch(`/api/conference/${sessionState.conference_id}`).then((res) => res.json());
  localStorage.setItem("currentConference", JSON.stringify(updatedConference));
}

function updateDOM() {
  // Delete all sessions
  while (root.querySelector(".session")) {
    root.removeChild(root.querySelector(".session"));
  }

  // Add all sessions
  let sessions = JSON.parse(localStorage.getItem("currentConference")).session;
  addAllSessions(sessions);
}

async function submitToAPI(sessionState, presentationsState) {
  await fetch(`/api/conference/${sessionState.conference_id}/${sessionState.session_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sessionState),
  });

  // Delete all of its presentations then add the new ones
  await fetch(`/api/presentation/${sessionState.session_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })

  // Add new presentations
  await fetch(`/api/presentation/${sessionState.session_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(presentationsState),
  });

  const updatedConference = await fetch(`/api/conference/${sessionState.conference_id}`).then((res) => res.json());
  localStorage.setItem("currentConference", JSON.stringify(updatedConference));
}

async function updateSession() {
  let {sessionState, presentationsState} = readInputs();
  if (sessionState === false || presentationsState === false) {
    handleHide();
    return;
  }

  // Send to Database
  await submitToAPI(sessionState, presentationsState);
  
  // Update the session in the DOM
  updateDOM();
  
  handleHide();
  window.location.reload();
}

async function getAllPapers(existingPapers) {
  let papers = await fetch(`../api/paper`);
  papers = await papers.json();
  papers = papers.filter((e) => e.status === true);

  let conferences = await fetch(`../api/conference`);
  conferences = await conferences.json();
  let sessions = conferences.map((e) => e.sessions).flat();
  // If the paper is already in a session, remove it from the papers array
  // get all the papers in the sessions then loop to remove them
  let papersInSessions = sessions.map((e) => e.papers).flat();
  // if the paper is in existingPapers, dont remove it from the papers array, and dont add it if its in the papersInSessions
 
  papersInSessions = papersInSessions.filter((e) => ! existingPapers.includes(e));
  
  papersInSessions.map((e) => {
    papers = papers.filter((paper) => paper.id !== e);
  });

  return papers;
}

let currentLoaddedSessionIndex = 0;

function formatDate(d) {
  let date = new Date(Date.parse(d));
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

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
  let dateView = formatDate(session.day);

  let container = document.createElement("div");
  container.classList = "session";
  container.id = session.session_id;
  //return an array of paper objects
  let presentations = session.presentation;
  let papers = await Promise.all(
    presentations.map((presentation) => paperFinder(presentation.paper_id))
  );

  let presentationDivs = "";
  papers.map((paper) => {
    let presentationDiv = `<div class="paper" id="${paper.paper_id}"><span>&#183;   ${paper.title}</span></div>`;
    presentationDivs += presentationDiv;
  });
  let content = `<h2 data-rawdate="${session.day}">${dateView} - ${session.location_city}</h2>`;
  container.innerHTML = content;
  container.innerHTML += presentationDivs;
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
  // sessions.forEach(async (session) => {
  //   document.querySelector(".root").appendChild(await createSession(session));
  // });
  let sesionCount = 0;
  while (sesionCount <= 3) {
    if (sessions.length <= currentLoaddedSessionIndex) break;
    document.querySelector(".root").appendChild(await createSession(sessions[currentLoaddedSessionIndex++]));
    if (matchesFilter(document.querySelector(".filter input").value,sessions[currentLoaddedSessionIndex - 1].day)) {
      sesionCount++;
    }
  }
};

// const displayMoreButton = () => {
//   let moreButton = document.createElement("button");
//   moreButton.innerHTML = "Load More";
//   moreButton.classList = "more-button";
//   moreButton.addEventListener("click", () => {});
//   return moreButton;
// };
