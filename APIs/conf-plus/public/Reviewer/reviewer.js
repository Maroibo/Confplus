window.onload = async () => {
  // Check if user is logged in or not a reviewer
  const userID = localStorage["currentUser"];
  const user = await fetch(`../api/user/${userID}`).then((res) => res.json());
  if (user.reviewer.length === 0) window.location.href = "../login/login.html";
  await userDisplayer();
  const response = await fetch(`../api/review/${userID}?type=reviewer`);
  const filteredReviews = await response.json();
  filteredReviews.map(async (e) => {
    const card = await reviewCard(e);
    document.querySelector(".root").appendChild(card);
  });
  if (filteredReviews.length === 0) {
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

const reviewCard = async (review) => {
  const response = await fetch(`../api/paper/${review.paper_id}`);
  const paper = await response.json();
  const reviewContainer = document.createElement("div");
  reviewContainer.classList = "review-container";
  const pdfContainer = document.createElement("div");
  const pdfImage = document.createElement("img");
  pdfContainer.appendChild(pdfImage);
  pdfImage.src = "../recourses/icons/file-pdf-solid.svg";
  const paperTitle = document.createElement("p");
  paperTitle.innerHTML = paper.title;
  const paperAuthor = document.createElement("p");
  paperAuthor.innerHTML = await getAuthorNames(paper.Author_Paper);
  const paperAbstract = document.createElement("p");
  paperAbstract.innerHTML = paper.abstract;
  reviewContainer.appendChild(pdfContainer);
  reviewContainer.appendChild(paperTitle);
  reviewContainer.appendChild(paperAuthor);
  reviewContainer.appendChild(paperAbstract);
  // create an element to show if the done is pending or not
  const done = document.createElement("div");
  done.innerHTML = review.done === "done" ? "Reviewed" : "Pending";
  done.classList = review.done === "done" ? "tag done" : "tag pending";
  reviewContainer.appendChild(done);
  reviewContainer.addEventListener("click", () => {
    localStorage["currentReview"] = JSON.stringify(review);
    window.location.href = "../Reviewer/review/review.html";
  });
  return reviewContainer;
};
const getAuthorNames = async (Author_Paper) => {
  let authors = Author_Paper.map((e) => e.author_id);
  let authorNames = [];
  for (let i = 0; i < authors.length; i++) {
    const response = await fetch(`../api/user/${authors[i]}`);
    const author = await response.json();
    authorNames.push(`${author.last_name} ${author.first_name}`);
  }
  return authorNames.join(", ");
};
