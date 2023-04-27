// let sessions = conference.sessions;
let sessions = [];

window.onload = async () => {
  await userDisplayer();
  let currentConference = localStorage["currentConference"];
  let response = await fetch("../api/conference");
  const conferences = await response.json();
  
  if (conferences.error) {
    
    document.querySelector(".root").classList += " empty";
    emptyPageScreen();
    return;
  } else if (currentConference === "" || currentConference === undefined) {
    localStorage["currentConference"] = conferences[0].id;
    currentConference = localStorage["currentConference"];
  }
  response = await fetch(`../api/conference/${currentConference}`);
  const conference = await response.json();

  sessions.push(...conference.sessions);

  let title = `<h1>Conference Sessions Schedule</h1>`;
  let conferenceTitle = `<h2 class="conference-title">Conference: ${conference.title}</h2>`;
  let card = `<div class="card"></div>`;
  let filter = `<div class="filter"><input type="date"/></div>`;
  document.querySelector(".root").innerHTML += card;
  document.querySelector(".card").innerHTML += title;
  document.querySelector(".card").innerHTML += conferenceTitle;
  document.querySelector(".card").innerHTML += filter;

  document
    .querySelector(".filter input")
    .addEventListener("change", (e) => filterSessions(e.target.value));
  
  await addAllSessions(sessions);
};

let currentLoaddedSessionIndex = 0;

let emptyPageScreen = () => {
  let container = document.createElement("div");
  let mainImage = document.createElement("img");
  mainImage.src = "../recourses/Group 26649.svg";
  let text = document.createElement("p");
  text.innerHTML = "This page seems to be empty";
  container.classList += "empty-container";
  container.appendChild(mainImage);
  container.appendChild(text);
  document.querySelector(".root").appendChild(container);
  console.log("empty");
};

let createSession = async (session) => {
  let date = new Date(Date.parse(session.day));

  let dateView = date.toDateString();
  dateView = dateView.split(" ");
  dateView.shift();
  dateView = dateView.join(" ");
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
  // document.querySelector(".root").style.height = null;
  document
    .querySelectorAll(".session")
    .forEach((e) => (e.style.display = "none"));
};



const filterSessions = (date) => {
  if (date === "") {
    document.querySelector(".card").style.height = "auto";
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
  if (document.querySelector(".more-button")) {
    document.querySelector(".more-button").remove();
  }
  while (sesionCount < 3 && currentLoaddedSessionIndex < sessions.length) {
    document
      .querySelector(".card")
      .appendChild(await createSession(sessions[currentLoaddedSessionIndex++]));
    let date = new Date(Date.parse(sessions[currentLoaddedSessionIndex - 1].day));

    let dateView = date.toDateString();
    dateView = dateView.split(" ");
    dateView.shift();
    dateView = dateView.join(" ");
    
    if (
      matchesFilter(
        document.querySelector(".filter input").value,
        dateView
      ) || document.querySelector(".filter input").value === ""
    ) {
      sesionCount++;
    }
  }
  filterSessions(document.querySelector(".filter input").value);
  if (currentLoaddedSessionIndex < sessions.length) {
    document.querySelector(".card").appendChild(displayMoreButton());
  }
};


const displayMoreButton = () => {
  let moreButton = document.createElement("button");
  moreButton.innerHTML = "Load More";
  moreButton.classList = "more-button";
  moreButton.addEventListener("click", () => {
    addAllSessions(sessions);
  });
  return moreButton;
};

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
    document.querySelector(".root").appendChild(logoutDiv);
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
