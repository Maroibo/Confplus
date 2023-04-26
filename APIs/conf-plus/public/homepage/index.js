const conferenceCardsContainer = document.querySelector(".conference-cards-container");
getConferences();

const conferencesList = [];

function showMoreConferences() {
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
    showMoreConferences();
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
