const conferenceCardsContainer = document.querySelector(".conference-cards-container");
const conferencesContainer = document.querySelector(".conferences-container");

window.onload = async () => {
    await userDisplayer();
    await getConferences();
    const userID = localStorage["currentUser"];
    const user = await fetch(`../api/user/${userID}`).then((res) => res.json());

    if (user.role === "organizer") {
      const editScheduleBtn = document.querySelectorAll(".edit-schedule-btn");
        editScheduleBtn.forEach(btn => {btn.style.display = "block"})
    }
};




const conferencesList = [];

async function showMoreConferences() {
    conferenceCardsContainer.removeChild(conferenceCardsContainer.lastChild);
    for (let index = 0; index < conferencesList.length; index++) {
        const conference = conferencesList[index];
        if (index > 2) {
          const loadMoreBtn = document.createElement("button");
          loadMoreBtn.classList.add("load-more-btn");
          loadMoreBtn.innerText = "Load more";
          conferenceCardsContainer.appendChild(loadMoreBtn);
          loadMoreBtn.addEventListener('click', showMoreConferences);
          break;
        }
        conferenceCardsContainer.appendChild(conferenceToHTML(conference));
      }
      conferencesList.splice(0, 3);
}

async function getConferences() {
    const response = await fetch("/api/conference");
    const conferences = await response.json();
    conferencesList.push(...conferences);
    await showMoreConferences();
}

function conferenceToHTML(conference) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const startDate = new Date(conference.start_date);
    const endDate = new Date(conference.end_date);
    
    const startDay = startDate.getDate();
    const startMonth = monthNames[startDate.getMonth()];
    const startYear = startDate.getFullYear();
    const endDay = endDate.getDate();
    const endMonth = monthNames[endDate.getMonth()];
    const endYear = endDate.getFullYear();

    const conferenceCard = document.createElement("div");
    conferenceCard.classList.add("conference-card");
    conferenceCard.dataset.conferenceID = conference.id;

    const conferenceImgContainer = document.createElement("div");
    conferenceImgContainer.classList.add("conference-img-container");

    const conferenceImg = document.createElement("img");
    conferenceImg.src = "../recourses/Photos/toronto.jpg";
    conferenceImg.alt = "Toranto";
    conferenceImgContainer.appendChild(conferenceImg);

    conferenceCard.appendChild(conferenceImgContainer);

    const conferenceDetailsContainer = document.createElement("div");
    conferenceDetailsContainer.classList.add("conference-details-container");

    const conferenceTitleContainer = document.createElement("div");
    conferenceTitleContainer.classList.add("conference-title-container");

    const conferenceTitle = document.createElement("h3");
    conferenceTitle.classList.add("conference-title");
    conferenceTitle.innerText = conference.title;

    conferenceTitleContainer.appendChild(conferenceTitle);

    conferenceDetailsContainer.appendChild(conferenceTitleContainer);

    const conferenceDateContainer = document.createElement("div");
    conferenceDateContainer.classList.add("conference-date-container");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-schedule-btn");
    editBtn.innerText = "Edit schedule";

    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const conferenceID = conferenceCard.dataset.conferenceID;
        localStorage["currentConference"] = `${conferenceID}`;
        window.location.href = "../schedule-editor/schedule-editor.html";
    });

    conferenceDetailsContainer.appendChild(editBtn);


    const calendarIcon = document.createElement("img");
    calendarIcon.src = "../recourses/icons/calendar.svg";
    calendarIcon.alt = "Calendar icon";
    calendarIcon.classList.add("calendar-icon");

    conferenceDateContainer.appendChild(calendarIcon);

    const conferenceDate = document.createElement("p");
    conferenceDate.classList.add("conference-date");
    conferenceDate.innerText = `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;

    conferenceDateContainer.appendChild(conferenceDate);

    conferenceDetailsContainer.appendChild(conferenceDateContainer);

    conferenceCard.appendChild(conferenceDetailsContainer);

    conferenceCard.addEventListener('click', () => {
        const conferenceID = conferenceCard.dataset.conferenceID;
        goToSchedule(conferenceID);
    });

    return conferenceCard;
}

function goToSchedule(conferenceID) {
    localStorage["currentConference"] = `${conferenceID}`;
    window.location.href = "../conference-schedule/confrence-schedule.html";
}


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
      logoutDiv.style.height = "50px";
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
      document.querySelector("nav").appendChild(logoutDiv);
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
  