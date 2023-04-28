window.onload = async () => {
  await userDisplayer();
  const currentConference = localStorage["currentConference"];
  if (typeof currentConference !== "undefined" && currentConference !== "") {
    const response = await fetch(`../api/conference/${currentConference}`);
    const conference = await response.json();
    // if the page is empty show the empty page screen
    if (conference.sessions.length === 0) {
      document.querySelector(".root").classList += " empty";
      emptyPageScreen();
      return;
    }
    let title = `<h1>Coference Schedule</h1>`;
    let filter = `<div class="filter"><input type="date"/></div>`;
    document.querySelector(".root").innerHTML += title;
    document.querySelector(".root").innerHTML += filter;
    document
      .querySelector(".filter input")
      .addEventListener("change", (e) => filterSessions(e.target.value));
    let sessions = conference.sessions;
    // let sessions = [
    //   {
    //     location: "Rome",
    //     papers: [
    //       "64tfBwIuNjGIED0CtVD28",
    //       "64tfBwIuNjGIED0CtVD28",
    //       "64tfBwIuNjGIED0CtVD28",
    //     ],
    //     day: "2023-03-19T21:00:00.000Z",
    //   },
    //   {
    //     location: "Hanoi",
    //     papers: [
    //       "gVkiGaekL_GdA8FK1PxN2",
    //       "gVkiGaekL_GdA8FK1PxN2",
    //       "gVkiGaekL_GdA8FK1PxN2",
    //     ],
    //     day: "2023-04-01T14:30:00.000Z",
    //   },
    //   {
    //     location: "Lisbon",
    //     papers: ["64tfBwIuNjGIED0CtVD28", "64tfBwIuNjGIED0CtVD28"],
    //     day: "2023-04-15T09:00:00.000Z",
    //   },
    //   {
    //     location: "Lisbon",
    //     papers: ["64tfBwIuNjGIED0CtVD28", "64tfBwIuNjGIED0CtVD28"],
    //     day: "2023-04-15T09:00:00.000Z",
    //   },
    //   {
    //     location: "Lisbon",
    //     papers: ["64tfBwIuNjGIED0CtVD28", "64tfBwIuNjGIED0CtVD28"],
    //     day: "2023-04-15T09:00:00.000Z",
    //   },
    //   {
    //     location: "Lisbon",
    //     papers: ["64tfBwIuNjGIED0CtVD28", "64tfBwIuNjGIED0CtVD28"],
    //     day: "2023-04-15T09:00:00.000Z",
    //   },
    // ];
    await addAllSessions(sessions);
  } else {
    document.querySelector(".root").classList += " empty";
    emptyPageScreen();
  }
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
  let content = `<h2>${dateView}-${session.location}</h2>`;
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
  document.querySelector(".root").style.height = null;
  document
    .querySelectorAll(".session")
    .forEach((e) => (e.style.display = "none"));
};
const filterSessions = (date) => {
  if (date === "") {
    document.querySelector(".root").style.height = "auto";
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
  if (currentLoaddedSessionIndex >= sessions.length) {
    document.querySelector(".more-button").style.display = "none";
  }
};
const displayMoreButton = () => {
  let moreButton = document.createElement("button");
  moreButton.innerHTML = "Load More";
  moreButton.classList = "more-button";
  moreButton.addEventListener("click", () => {
    console.log("clicked");
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
