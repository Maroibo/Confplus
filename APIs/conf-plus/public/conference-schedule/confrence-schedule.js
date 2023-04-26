window.onload = async () => {
  await userDisplayer();
  const currentConference = localStorage["currentConference"];
  
  if (typeof currentConference !== "undefined" && currentConference !== "") {
    const response = await fetch(`../api/conference/${currentConference}`);
    const conference = await response.json();
    let filter = `<div class="filter"><span>Filter</span><input type="date"/></div>`;
    document.querySelector(".root").innerHTML = filter;
    document
      .querySelector(".filter input")
      .addEventListener("change", filterSessions);
    let sessions = conference.sessions;
    addAllSessions(sessions);
  } else {
    document.querySelector(".root").classList += " empty";
    emptyPageScreen();
  }
};

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

let createSession = (session) => {
  let date = new Date(Date.parse(session.day));
  let dateView = date.toDateString();
  dateView = dateView.split(" ");
  dateView.shift();
  dateView = dateView.join(" ");
  let container = document.createElement("div");
  container.classList = "session";
  let partitions = session.partitions.reduce((a, e) => {
    let time = new Date(Date.parse(e.time)).getHours();
    time += ":00";
    a += `<div class="paper">
  <span>${time}</span>
  <span>&#183;   ${paperFinder(e.paper).title}</span>
</div>`;
    return a;
  }, "");
  let content = `<h2>${dateView}</h2>
  ${partitions}
</div>`;
  container.innerHTML = content;
  return container;
};

let paperFinder = (paperId) => {
  let papers = JSON.parse(localStorage["papers"]);
  return papers.find((e) => e.id === paperId);
};
let filterSessions = () => {
  reset();
  if (document.querySelector(".filter input").value === "") {
    let sessions = JSON.parse(localStorage["conferences"])[0].sessions;
    addAllSessions(sessions);
    return;
  }
  let selectedDate = new Date(document.querySelector(".filter input").value);
  selectedDate.setHours(0, 0, 0, 0);
  let sessionContainers = document.querySelectorAll(".session");
  let counter = 0;
  sessionContainers.forEach((container) => {
    let dateView = container.querySelector("h2").textContent;
    let sessionDate = new Date(Date.parse(dateView));
    sessionDate.setHours(0, 0, 0, 0);
    if (sessionDate.getTime() === selectedDate.getTime()) {
      container.style.display = "block";
      counter++;
    } else {
      container.style.display = "none";
    }
  });
  if (counter === 0) {
    emptyPageScreen();
    document.querySelector(".root").style.height = "86%";
    document.querySelector(".empty-container").style.marginTop = "-20px";
  }
};

let reset = () => {
  document.querySelector(".root").style.height = null;
  document
    .querySelectorAll(".session")
    .forEach((e) => (e.style.display = "none"));
  document.querySelectorAll(".empty-container").forEach((e) => e.remove());
};
let addAllSessions = (sessions) => {
  sessions.map((e) =>
    document.querySelector(".root").appendChild(createSession(e))
  );
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





