window.onload = async () => {
  // Check if user is logged in or not an author
  const userID = localStorage["currentUser"];
  const user1 = await fetch(`../api/user/${userID}`).then((res) => res.json());
  if (user1.organizer.length === 0)
    window.location.href = "../login/login.html";
  await userDisplayer();
  const user = document.querySelector("#user-doughnut");
  const paper = document.querySelector("#paper-bar");
  // fetch the papres states by callying the api
  const response = await fetch("../api/stats/papersStates");
  const papersStates = await response.json();
  const response2 = await fetch("../api/stats/usersStates");
  const usersStates = await response2.json();
  const response3 = await fetch("../api/stats/avgPapers");
  const avgPapers = await response3.json();
  const response4 = await fetch("../api/stats/noConfSessions");
  const noConfSessions = await response4.json();
  const avgPapersDiv = document.querySelector("#avg-papers");
  avgPapersDiv.innerHTML = `${avgPapers.averageAuthorsPerPaper}`;
  const noConfSessionsDiv = document.querySelector("#no-conf-sessions");
  noConfSessionsDiv.innerHTML = `${noConfSessions.noOfConferenceSessions}`;
  new Chart(user, {
    type: "doughnut",
    data: {
      labels: ["Author", "Reviewer", "Organizer"],
      datasets: [
        {
          label: "# of Users",
          data: [
            usersStates.authors,
            usersStates.reviewers,
            usersStates.organizers,
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 15,
          borderWidth: 4,
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  new Chart(paper, {
    type: "bar",
    data: {
      labels: ["Accepted", "Rejected", "Pending"],
      datasets: [
        {
          label: "# of Papers",
          data: [
            papersStates.accepted,
            papersStates.rejected,
            papersStates.pending,
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          barThickness: 100,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
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
  if (user.author.length !== 0) userRole.innerHTML = "Author";
  else if (user.reviewer.length !== 0) userRole.innerHTML = "Reviewer";
  else if (user.organizer.length !== 0) userRole.innerHTML = "Organizer";
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
    document.querySelector(".main-container").appendChild(logoutDiv);
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
      window.location.href = "../homepage/index.html";
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
