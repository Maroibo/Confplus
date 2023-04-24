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
  userImage.innerHTML = `<img src=../recourses/user-solid.png"/>`;
  const userName = document.createElement("span");
  userName.innerHTML = `${user.last_name}, ${user.first_name}`;
  const userRole = document.createElement("span");
  userRole.innerHTML = `${user.role}`;
  userDiv.appendChild(userImage);
  userDiv.appendChild(userName);
  userDiv.appendChild(userRole);
  const nav = document.querySelector("#nav-ul");
  const loginOption = document.querySelector("#nav-ul li:last-child");
  nav.insertBefore(userDiv, loginOption);
  loginOption.remove();
};
