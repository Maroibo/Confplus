let sessionsList = [];

window.onload = async () => {
  await userDisplayer();
  let currentConference = localStorage["currentConference"];
  let response = await fetch(`../api/conference/${currentConference}`);
  const conference = await response.json();

  let title = `<h1>Schedule Editor</h1>`;
  let conferenceTitle = `<h2 class="conference-title">Conference: <span contentEditable="true">${conference.title}</span></h2>`;
  let card = `<div class="card"></div>`;


  document.querySelector(".root").innerHTML += card;
  document.querySelector(".card").innerHTML += title;
  document.querySelector(".card").innerHTML += conferenceTitle;
  let sessions = conference.sessions;

  sessionsList.push(...sessions);

  response = await fetch("../api/date");
  const dates = await response.json();
  response = await fetch("../api/location");
  const locations = await response.json();

  const datesDropDown = document.createElement("select");
  datesDropDown.classList = "dates";
  datesDropDown.innerHTML += `<option value="all">All Dates</option>`;
  dates.map((date) => {
    datesDropDown.innerHTML += `<option value="${date}">${date}</option>`;
  });

  const locationsDropDown = document.createElement("select");
  locationsDropDown.classList = "locations";
  locationsDropDown.innerHTML += `<option value="all">All Locations</option>`;
  locations.map((location) => {
    locationsDropDown.innerHTML += `<option value="${location}">${location}</option>`;
  });

  const ddContainer = document.createElement("div");
  ddContainer.classList = "dd-container";
  ddContainer.appendChild(datesDropDown);
  ddContainer.appendChild(locationsDropDown);

  const addPaperButton = document.createElement("button");
  addPaperButton.classList = "add-paper";
  addPaperButton.innerText = "+";
  ddContainer.appendChild(addPaperButton);

  let deleteSessionButton = document.createElement("button");
  deleteSessionButton.classList = "delete-session";
  deleteSessionButton.innerText = "Delete session";
  ddContainer.appendChild(deleteSessionButton);

  if (sessions.length !== 0) {
    await addAllSessions(sessions);
  }

  document.querySelectorAll(".session").forEach((session) => {
    session.insertBefore(ddContainer.cloneNode(true), session.children[1]);
  });

  // Event Listeners
  document.querySelectorAll(".delete-session").forEach((deleteSession) => {
    deleteSession.addEventListener("click", (e) => {
      e.target.parentElement.parentElement.remove();
    })
  });

  document.querySelectorAll(".dates").forEach((dateDD) => {
    dateDD.addEventListener("change", (e) => {
      const selectedDate = e.target.value;
      let date = new Date(Date.parse(selectedDate));
      let dateView = date.toDateString();
      dateView = dateView.split(" ");
      dateView.shift();
      dateView = dateView.join(" ");
      let h2 = e.target.parentElement.parentElement.querySelector("h2");
      let h2Values = h2.innerHTML.split(" - ");
      h2Values[0] = dateView;
      h2.innerHTML = h2Values.join(" - ");
    });
  });

  document.querySelectorAll(".locations").forEach((locationDD) => {
    locationDD.addEventListener("change", (e) => {
      const selectedLocation = e.target.value;
      let h2 = e.target.parentElement.parentElement.querySelector("h2");
      let h2Values = h2.innerHTML.split(" - ");
      h2Values[1] = selectedLocation;
      h2.innerHTML = h2Values.join(" - ");
    });
  });

  document.querySelectorAll(".add-paper").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let partition = document.createElement('div');
      partition.className = "paper";
      partition.innerHTML = `<span contentEditable="true"></span>
                              <button class="delete">X</button>`;
      e.target.parentElement.parentElement.appendChild(partition);
      
      // Add event listener to new delete button
      partition.querySelector('.delete').addEventListener('click', (e) => {
        e.target.parentElement.remove();
      });
    });
  });
  
  document.querySelectorAll(".delete").forEach((btn) => {
    btn.removeEventListener("click", (e) => {
      e.target.parentElement.remove();
    });
    btn.addEventListener("click", (e) => {
      e.target.parentElement.remove();
    });
  });


  let addSessionButton = document.createElement("button");
  addSessionButton.classList = "add-session";
  addSessionButton.innerText = "Add a new session";
  document.querySelector(".card").insertBefore(addSessionButton, document.querySelector(".card").children[2]);
  
  addSessionButton.addEventListener("click", async (e) => {
    let newSession = document.createElement("div");
    newSession.classList = "session";

    let h2 = document.createElement("h2");
    h2.innerText = "Jan 01 2021 - location";
    newSession.appendChild(h2);

    newSession.appendChild(ddContainer.cloneNode(true));
    document.querySelector(".card").insertBefore(newSession, document.querySelector(".card").children[3]);

    // Event Listeners
    document.querySelectorAll(".delete-session").forEach((deleteSession) => {
      deleteSession.removeEventListener("click", (e) => {
        e.target.parentElement.parentElement.remove();
      })
      deleteSession.addEventListener("click", (e) => {
        e.target.parentElement.parentElement.remove();
      })
    });
    
    document.querySelectorAll(".dates").forEach((dateDD) => {
      dateDD.removeEventListener("change", (e) => {
        const selectedDate = e.target.value;
        let date = new Date(Date.parse(selectedDate));
        let dateView = date.toDateString();
        dateView = dateView.split(" ");
        dateView.shift();
        dateView = dateView.join(" ");
        let h2 = e.target.parentElement.parentElement.querySelector("h2");
        let h2Values = h2.innerHTML.split(" - ");
        h2Values[0] = dateView;
        h2.innerHTML = h2Values.join(" - ");
      });
      dateDD.addEventListener("change", (e) => {
        const selectedDate = e.target.value;
        let date = new Date(Date.parse(selectedDate));
        let dateView = date.toDateString();
        dateView = dateView.split(" ");
        dateView.shift();
        dateView = dateView.join(" ");
        let h2 = e.target.parentElement.parentElement.querySelector("h2");
        let h2Values = h2.innerHTML.split(" - ");
        h2Values[0] = dateView;
        h2.innerHTML = h2Values.join(" - ");
      });
    });
  
    document.querySelectorAll(".locations").forEach((locationDD) => {
      locationDD.removeEventListener("change", (e) => {
        const selectedLocation = e.target.value;
        let h2 = e.target.parentElement.parentElement.querySelector("h2");
        let h2Values = h2.innerHTML.split(" - ");
        h2Values[1] = selectedLocation;
        h2.innerHTML = h2Values.join(" - ");
      });
      locationDD.addEventListener("change", (e) => {
        const selectedLocation = e.target.value;
        let h2 = e.target.parentElement.parentElement.querySelector("h2");
        let h2Values = h2.innerHTML.split(" - ");
        h2Values[1] = selectedLocation;
        h2.innerHTML = h2Values.join(" - ");
      });
    });
  
    document.querySelectorAll(".add-paper").forEach((btn) => {
      btn.removeEventListener("click", (e) => {
        let partition = document.createElement('div');
        partition.className = "paper";
        partition.innerHTML = `<span contentEditable="true"></span>
                                <button class="delete">X</button>`;
        e.target.parentElement.parentElement.appendChild(partition);
        
        // Add event listener to new delete button
        partition.querySelector('.delete').addEventListener('click', (e) => {
          e.target.parentElement.remove();
        });
      });
      
      btn.addEventListener("click", (e) => {
        let partition = document.createElement('div');
        partition.className = "paper";
        partition.innerHTML = `<span contentEditable="true"></span>
                                <button class="delete">X</button>`;
        e.target.parentElement.parentElement.appendChild(partition);
        
        // Add event listener to new delete button
        partition.querySelector('.delete').addEventListener('click', (e) => {
          e.target.parentElement.remove();
        });
      });
    });
    
    document.querySelectorAll(".delete").forEach((btn) => {
      btn.removeEventListener("click", (e) => {
        e.target.parentElement.remove();
      });
      btn.addEventListener("click", (e) => {
        e.target.parentElement.remove();
      });
    });
  });


  // save button
  let saveButton = document.createElement("button");
  saveButton.classList = "save";
  saveButton.innerText = "Save";
  document.querySelector(".card").appendChild(saveButton);

};

let currentLoaddedSessionIndex = 0;

let createSession = async (session) => {
  let date = new Date(Date.parse(session.day));

  let dateView = date.toDateString();
  dateView = dateView.split(" ");
  dateView.shift();
  dateView = dateView.join(" ");
  let container = document.createElement("div");
  container.classList = "session";
  container.id = session.id;
  //return an array of paper objects
  let papers = await Promise.all(
    session.papers.map(async (e) => await paperFinder(e))
  );
  let partitions = "";
  papers.map((e) => {
    let partition = `<div class="paper" id="${e.id}"><span contentEditable="true">${e.id}</span>
    <button class="delete">X</button>
    </div>`;
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

let addAllSessions = async (sessions) => {
  while (currentLoaddedSessionIndex < sessions.length) {
    document
      .querySelector(".card")
      .appendChild(await createSession(sessions[currentLoaddedSessionIndex++]));
    let date = new Date(
      Date.parse(sessions[currentLoaddedSessionIndex - 1].day)
    );

    let dateView = date.toDateString();
    dateView = dateView.split(" ");
    dateView.shift();
    dateView = dateView.join(" ");
  }
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
