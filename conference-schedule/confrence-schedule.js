window.onload = () => {
  let empty = false;
  if (empty) {
    document.querySelector(".root").classList += " empty";
    console.log(document.querySelector(".root"));
    document.querySelector(".root").appendChild(emptyPageScreen());
  } else {
    let filter = `<div class="filter"><span>Filter</span><input type="date"/></div>`;
    document.querySelector(".root").innerHTML = filter;
    document
      .querySelector(".filter input")
      .addEventListener("change", filterSessions);
    let sessions = JSON.parse(localStorage["conferences"])[0].sessions;
    addAllSessions(sessions);
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

let papers = [
  {
    title: "AI Technology",
    abstract:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit fugiat nemo" +
      "laborum deserunt illo enim optio. Doloribus veritatis modi voluptates magni officia, magnam minus repellendus culpa corporis deleniti quas tempore.",
    status: true,
    id: 3023,
    document: "URL-to-one-drive",
    authors: [
      {
        id: 14,
        affiliation: "PHD",
        main: true,
      },
      {
        id: 15,
        affiliation: "PHD",
        main: false,
      },
      {
        id: 16,
        affiliation: "PHD",
        main: false,
      },
    ],
  },
  {
    title: "Cryptography",
    abstract:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit fugiat nemo" +
      "laborum deserunt illo enim optio. Doloribus veritatis modi voluptates magni officia, magnam minus repellendus culpa corporis deleniti quas tempore.",
    status: true,
    id: 3024,
    document: "URL-to-one-drive",
    authors: [
      {
        id: 15,
        affiliation: "PHD",
        main: true,
      },
      {
        id: 16,
        affiliation: "PHD",
        main: false,
      },
      {
        id: 17,
        affiliation: "PHD",
        main: false,
      },
    ],
  },
  {
    title: "Python",
    abstract:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit fugiat nemo" +
      "laborum deserunt illo enim optio. Doloribus veritatis modi voluptates magni officia, magnam minus repellendus culpa corporis deleniti quas tempore.",
    status: true,
    id: 1023,
    document: "URL-to-one-drive",
    authors: [
      {
        id: 14,
        affiliation: "PHD",
        main: true,
      },
      {
        id: 15,
        affiliation: "PHD",
        main: false,
      },
      {
        id: 16,
        affiliation: "PHD",
        main: false,
      },
    ],
  },
  {
    title: "Java",
    abstract:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit fugiat nemo" +
      "laborum deserunt illo enim optio. Doloribus veritatis modi voluptates magni officia, magnam minus repellendus culpa corporis deleniti quas tempore.",
    status: true,
    id: 3533,
    document: "URL-to-one-drive",
    authors: [
      {
        id: 18,
        affiliation: "PHD",
        main: true,
      },
      {
        id: 19,
        affiliation: "PHD",
        main: false,
      },
      {
        id: 20,
        affiliation: "PHD",
        main: false,
      },
    ],
  },
  {
    title: "C++",
    abstract:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit fugiat nemo" +
      "laborum deserunt illo enim optio. Doloribus veritatis modi voluptates magni officia, magnam minus repellendus culpa corporis deleniti quas tempore.",
    status: true,
    id: 5443,
    document: "URL-to-one-drive",
    authors: [
      {
        id: 14,
        affiliation: "PHD",
        main: true,
      },
      {
        id: 16,
        affiliation: "PHD",
        main: false,
      },
      {
        id: 18,
        affiliation: "PHD",
        main: false,
      },
    ],
  },
];
papers = JSON.stringify(papers);
localStorage["papers"] = papers;

let reviews = [
  {
    reviewer: 4,
    paper: 5443,
    overall: 1,
    contribution: 0,
    strength:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit fugiat nemo" +
      "laborum deserunt illo enim optio. Doloribus veritatis modi voluptates magni officia, magnam minus repellendus culpa corporis deleniti quas tempore.",
    weakness:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit fugiat nemo" +
      "laborum deserunt illo enim optio. Doloribus veritatis modi voluptates magni officia, magnam minus repellendus culpa corporis deleniti quas tempore.",
    accepted: true,
    done: true,
  },
  {
    reviewer: 5,
    paper: 3533,
    overall: 2,
    contribution: 1,
    strength:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit fugiat nemo" +
      "laborum deserunt illo enim optio. Doloribus veritatis modi voluptates magni officia, magnam minus repellendus culpa corporis deleniti quas tempore.",
    weakness:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit fugiat nemo" +
      "laborum deserunt illo enim optio. Doloribus veritatis modi voluptates magni officia, magnam minus repellendus culpa corporis deleniti quas tempore.",
    accepted: false,
    done: true,
  },
  {
    reviewer: 6,
    paper: 1023,
    overall: -1,
    contribution: -1,
    strength:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit fugiat nemo" +
      "laborum deserunt illo enim optio. Doloribus veritatis modi voluptates magni officia, magnam minus repellendus culpa corporis deleniti quas tempore.",
    weakness:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit fugiat nemo" +
      "laborum deserunt illo enim optio. Doloribus veritatis modi voluptates magni officia, magnam minus repellendus culpa corporis deleniti quas tempore.",
    accepted: true,
    done: true,
  },
  {
    reviewer: 7,
    paper: 3023,
    overall: 0,
    contribution: 2,
    strength:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit fugiat nemo" +
      "laborum deserunt illo enim optio. Doloribus veritatis modi voluptates magni officia, magnam minus repellendus culpa corporis deleniti quas tempore.",
    weakness:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit fugiat nemo" +
      "laborum deserunt illo enim optio. Doloribus veritatis modi voluptates magni officia, magnam minus repellendus culpa corporis deleniti quas tempore.",
    accepted: true,
    done: true,
  },
];
reviews = JSON.stringify(reviews);
localStorage["reviews"] = reviews;
let date = new Date("10-March-2023 12:45:00");
let dateView = date.toDateString().split(" ");
dateView.shift();
dateView = dateView.join(" ");
console.log(date);
let confrences = [
  {
    "start-date": new Date("10-March-2023"),
    "end-date": new Date("22-March-2023"),
    location: "Toronto",
    venue: "Building 1",
    sessions: [
      {
        day: new Date("10-March-2023"),
        room: 75,
        partitions: [
          {
            paper: 1023,
            presenter: 16,
            time: new Date("11-March-2023 14:00:00"),
          },
          {
            paper: 3024,
            presenter: 17,
            time: new Date("11-March-2023 15:00:00"),
          },
          {
            paper: 5443,
            presenter: 18,
            time: new Date("11-March-2023 16:00:00"),
          },
        ],
      },
      {
        day: new Date("11-March-2023"),
        room: 75,
        partitions: [
          {
            paper: 1023,
            presenter: 16,
            time: new Date("11-March-2023 14:00:00"),
          },
          {
            paper: 3024,
            presenter: 17,
            time: new Date("11-March-2023 15:00:00"),
          },
          {
            paper: 5443,
            presenter: 18,
            time: new Date("11-March-2023 16:00:00"),
          },
        ],
      },
      {
        day: new Date("12-March-2023"),
        room: 75,
        partitions: [
          {
            paper: 1023,
            presenter: 16,
            time: new Date("11-March-2023 14:00:00"),
          },
          {
            paper: 3024,
            presenter: 17,
            time: new Date("11-March-2023 15:00:00"),
          },
          {
            paper: 5443,
            presenter: 18,
            time: new Date("11-March-2023 16:00:00"),
          },
        ],
      },
      {
        day: new Date("13-March-2023"),
        room: 75,
        partitions: [
          {
            paper: 1023,
            presenter: 16,
            time: new Date("11-March-2023 14:00:00"),
          },
          {
            paper: 3024,
            presenter: 17,
            time: new Date("11-March-2023 15:00:00"),
          },
          {
            paper: 5443,
            presenter: 18,
            time: new Date("11-March-2023 16:00:00"),
          },
        ],
      },
    ],
  },
];

confrences = JSON.stringify(confrences);
localStorage["conferences"] = confrences;
