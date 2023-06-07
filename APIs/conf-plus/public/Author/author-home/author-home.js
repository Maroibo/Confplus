window.onload = async () => {
  await userDisplayer();
  let title = `<h1>Papers List</h1>`;
  document.querySelector(".root").innerHTML += title;
  const response = await fetch(
    `../../api/paperByAuthor/${localStorage["currentUser"]}`
  );
  const papers = await response.json();
  console.log(papers);
  if (papers.length === 0) {
    emptyPageScreen();
    return;
  }
  // make a add paper button and a select where you could filter by the status of the paper
  let addPaperButton = document.createElement("button");
  addPaperButton.classList = "add-paper-button";
  // add plus icon
  addPaperButton.addEventListener("click", () => {
    window.location.href = "../author.html";
  });
  addPaperButton.innerHTML = "+ Add Paper";
  let select = document.createElement("select");
  select.classList = "select";
  let option1 = document.createElement("option");
  option1.innerHTML = "All";
  let option2 = document.createElement("option");
  option2.innerHTML = "Accepted";
  let option3 = document.createElement("option");
  option3.innerHTML = "Rejected";
  let option4 = document.createElement("option");
  option4.innerHTML = "Pending";
  // add the i icon
  select.appendChild(option1);
  select.appendChild(option2);
  select.appendChild(option3);
  select.appendChild(option4);
  // add a rapper div with display flex and justify content space between
  let rapperDiv = document.createElement("div");
  rapperDiv.classList = "rapper-div";
  rapperDiv.appendChild(addPaperButton);
  rapperDiv.appendChild(select);
  document.querySelector(".root").appendChild(rapperDiv);
  select.addEventListener("change", () => {
    filterPapers(select.value);
  });
  // create a div with class papers
  let papersDiv = document.createElement("div");
  papersDiv.classList = "papers";
  document.querySelector(".root").appendChild(papersDiv);
  // create to spans one with paper title and the other with the status
  const paperTitle = document.createElement("span");
  paperTitle.innerHTML = "Paper Title";
  const paperStatus = document.createElement("span");
  paperStatus.innerHTML = "Status";
  // put them in a div with class paper-header
  const paperHeader = document.createElement("div");
  paperHeader.classList = "paper-header";
  paperHeader.appendChild(paperTitle);
  paperHeader.appendChild(paperStatus);
  papersDiv.appendChild(paperHeader);
  // loop through the papers and display them
  papers.forEach((paper) => {
    let paperDiv = paperDisplayer(paper);
    papersDiv.appendChild(paperDiv);
  });
  document.querySelector(".root").appendChild(papersDiv);
};

let userDisplayer = async () => {
  const userId = localStorage["currentUser"];
  if (userId === undefined || userId === "") return;
  const response = await fetch(`../../api/user/${userId}`);
  const user = await response.json();
  const userDiv = document.createElement("div");
  userDiv.classList = "user";
  const userImage = document.createElement("img");
  userImage.src = "../../recourses/icons/user-solid.svg";
  const userName = document.createElement("span");
  userName.innerHTML = `${user.last_name}, ${user.first_name}`;
  const userRole = document.createElement("span");
  if (user.author.length !== 0) userRole.innerHTML = "Author";
  else if (user.reviewer.length !== 0) userRole.innerHTML = "Reviewer";
  else if (user.organizer.length !== 0) userRole.innerHTML = "Organizer";
  const arrowDown = document.createElement("img");
  arrowDown.src = "../../recourses/icons/angle-down-solid.svg";
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
    logoutImage.src =
      "../../recourses/icons/arrow-right-from-bracket-solid.svg";
    logoutDiv.appendChild(logoutImage);
    logoutDiv.appendChild(logout);
    logoutDiv.addEventListener("click", () => {
      localStorage["currentUser"] = "";
      window.location.href = "../../login/login.html";
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
let emptyPageScreen = () => {
  let container = document.createElement("div");
  let mainImage = document.createElement("img");
  mainImage.src = "../../recourses/Group 26649.svg";
  let text = document.createElement("p");
  text.innerHTML = "This page seems to be empty";
  container.classList += "empty-container";
  container.appendChild(mainImage);
  container.appendChild(text);
  document.querySelector(".root").appendChild(container);
};

const paperDisplayer = (paper) => {
  // create a div with class paper
  let paperDiv = document.createElement("div");
  paperDiv.classList = "paper";
  // create a span with the paper title
  let paperTitle = document.createElement("span");
  paperTitle.innerHTML = paper.title;
  // create a span with the paper status
  let paperStatus = document.createElement("span");
  paperStatus.classList =
    paper.reviews[0].accepted === "yes"
      ? "tag accepted"
      : paper.reviews[0].accepted === "no"
      ? "tag rejected"
      : "tag pending";
  paperStatus.innerHTML =
    paper.reviews[0].accepted === "yes"
      ? "Accepted"
      : paper.reviews[0].accepted === "no"
      ? "Rejected"
      : "Pending";
  // add the spans to the paper div
  paperDiv.appendChild(paperTitle);
  paperDiv.appendChild(paperStatus);
  return paperDiv;
};

const filterPapers = (status) => {
  const papers = document.querySelectorAll(".paper");
  papers.forEach((paper) => {
    if (status === "All") {
      paper.style.display = "flex";
    } else if (status === "Accepted") {
      if (paper.querySelector(".tag").classList.contains("accepted")) {
        paper.style.display = "flex";
      } else {
        paper.style.display = "none";
      }
    } else if (status === "Rejected") {
      if (paper.querySelector(".tag").classList.contains("rejected")) {
        paper.style.display = "flex";
      } else {
        paper.style.display = "none";
      }
    } else if (status === "Pending") {
      if (paper.querySelector(".tag").classList.contains("pending")) {
        paper.style.display = "flex";
      } else {
        paper.style.display = "none";
      }
    }
  });
};
