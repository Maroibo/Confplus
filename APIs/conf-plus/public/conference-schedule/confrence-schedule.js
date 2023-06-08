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

window.onload = async () => {
  await userDisplayer();
  const currentConference = JSON.parse(localStorage.getItem("currentConference"));  
  if (typeof currentConference === undefined || currentConference === "") 
    window.location.href = "../homepage/index.html";
  
  // title filter and add session button
  let title = `<h1>Conference Schedule</h1>`;
  let filtersDiv = `<div class="filters">
  <div class="filter"><input type="date"/></div>
  <div class="filter"><select placeholder="Location"/></div>
  </div>`

  root.innerHTML += title;
  root.innerHTML += filtersDiv;

  let locationFilter = document.querySelector(".filters select");
  const allOption = document.createElement("option");
  allOption.value = "All";
  allOption.innerHTML = "All";
  locationFilter.appendChild(allOption);
  let locations = await fetch(`../api/location`).then((res) => res.json());
  locations = locations.map(location => location.city)
  locations.forEach((location) => {
    const option = document.createElement("option");
    option.value = location;
    option.innerHTML = location;
    locationFilter.appendChild(option);
  });
  document
  .querySelector(".filter select")
  .addEventListener("change", (e) => filterSessionsByLocation(e.target.value));

  document
    .querySelector(".filter input")
    .addEventListener("change", (e) => filterSessions(e.target.value));

  
  // Creating the sessions
  let sessions = currentConference.session;
  if (sessions.length === 0) {
    emptyPageScreen();
    return;
  }
  await addAllSessions(sessions);
};

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

const filterSessionsByLocation = (location) => {
  if (location === "All") {
    root.style.height = "auto";
    document
      .querySelectorAll(".session")
      .forEach((e) => (e.style.display = "block"));
    return;
  } else {
    reset();
    let sessions = document.querySelectorAll(".session");
    sessions.forEach((e) => {
      let sessionLocation = e.querySelector("h2").innerHTML.split("-");
      sessionLocation = sessionLocation[1].trim();
      if (sessionLocation === location) {
        e.style.display = "block";
      }
    });
  }
}

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

const displayMoreButton = () => {
  let moreButton = document.createElement("button");
  moreButton.innerHTML = "Load More";
  moreButton.classList = "more-button";
  moreButton.addEventListener("click", () => {});
  return moreButton;
};
