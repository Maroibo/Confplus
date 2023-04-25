const conferenceCardsContainer = document.querySelector(".conference-cards-container");
getConferences();

const conferencesList = [];

function showMoreConferences() {
    conferenceCardsContainer.innerHTML = conferencesList.map(conference => conferenceToHTML(conference)).join("");
}

async function getConferences() {
    const response = await fetch("/api/conference");
    const conferences = await response.json();
    conferencesList.push(...conferences);
    if (conferences.length > 3) {
        conferenceCardsContainer.innerHTML = conferences.slice(0, 3).map(conference => conferenceToHTML(conference)).join("") + "<button class='load-more-btn'>Load more</button>";
    } else {
        conferenceCardsContainer.innerHTML = conferences.map(conference => conferenceToHTML(conference)).join("");
    }
    const loadMoreBtn = document.querySelector('.load-more-btn');
    loadMoreBtn.addEventListener('click', showMoreConferences);
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

    return `<div class="conference-card">
                <div class="conference-img-container"><img src="../recourses/Photos/toronto.jpg" alt="Toranto"></div>
                <div class="conference-details-container">
                    <div class="conference-title-container"><h3 class="conference-title">${conference.title}</h3></div>
                    <div class="conference-date-container"><img src="../recourses/icons/calendar.svg" alt="Calendar icon" class="calendar-icon"><p class="conference-date"> ${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}</p></div>
                </div>
            </div>
            `;
}


