const reviewState = JSON.parse(localStorage.getItem("currentReview"));
window.onload = async () => {
  // Check if user is logged in or not an author
  const userID = localStorage["currentUser"];
  const user = await fetch(`../../api/user/${userID}`).then((res) =>
    res.json()
  );
  if (user.reviewer.length === 0) window.location.href = "../login/login.html";
  else if (reviewState.reviewer_id !== parseInt(userID)) {
    window.location.href = "../../Reviewer/reviewer.html";
  }
  await userDisplayer();
  if (typeof reviewState !== "undefined" && reviewState !== null) {
    await displayReview(reviewState);
  }
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
      window.location.href = "../../Reviewer/reviewer.html";
    } else if (userRole.innerHTML.toLowerCase() === "author") {
      window.location.href = "../../Author/author-home/author-home.html";
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
const displayReview = async (review) => {
  const paper = await getPapers(review.paper_id);
  const authorNames = await getAuthorNames(paper.Author_Paper);
  const titleDiv = document.querySelector(".paper-head p:first-of-type");
  titleDiv.innerHTML = paper.title;
  const authorDiv = document.querySelector(".paper-head p:last-of-type");
  authorDiv.innerHTML = authorNames;
  const abstractDiv = document.querySelector(".abstract p:first-of-type");
  abstractDiv.innerHTML = paper.abstract;
  const strengthTextArea = document.querySelector(".strength textarea");
  strengthTextArea.innerHTML = review.strength;
  const weaknessTextArea = document.querySelector(".weakness textarea");
  weaknessTextArea.innerHTML = review.weakness;
  const contribution = document.querySelector(".paper-cont .meter");
  const contributionChildren = contribution.children;
  // check the contribution and which ever value is equal to the contribution value add the class "active" to it
  for (let i = 0; i < contributionChildren.length; i++) {
    if (contributionChildren[i].innerHTML === `${review.contribution}`) {
      contributionChildren[i].classList.add("active");
    }
  }
  const overall = document.querySelector(".overall .meter");
  const overallChildren = overall.children;
  for (let i = 0; i < overallChildren.length; i++) {
    if (overallChildren[i].innerHTML === `${review.overall}`) {
      overallChildren[i].classList.add("active");
    }
  }
};
const getPapers = async (id) => {
  const response = await fetch(`../../api/paper/${id}`);
  const paper = await response.json();
  return paper;
};
const getAuthorNames = async (Author_Paper) => {
  let authors = Author_Paper.map((e) => e.author_id);
  let authorNames = [];
  for (let i = 0; i < authors.length; i++) {
    const response = await fetch(`../../api/user/${authors[i]}`);
    const author = await response.json();
    authorNames.push(`${author.last_name} ${author.first_name}`);
  }
  return authorNames.join(", ");
};

const contributionMeter = document.querySelectorAll(".paper-cont .meter span");
// loop through the contribution meter and add event listener to each span
for (let i = 0; i < contributionMeter.length; i++) {
  contributionMeter[i].addEventListener("click", () => {
    // remove the active class from all the spans
    for (let j = 0; j < contributionMeter.length; j++) {
      contributionMeter[j].classList.remove("active");
    }
    // add the active class to the span that was clicked
    contributionMeter[i].classList.add("active");
    reviewState.contribution = parseInt(contributionMeter[i].innerHTML);
    reviewUpdateHandler(reviewState);
  });
}
const overallMeter = document.querySelectorAll(".overall .meter span");
// loop through the overall meter and add event listener to each span
// update the review object
for (let i = 0; i < overallMeter.length; i++) {
  overallMeter[i].addEventListener("click", () => {
    // remove the active class from all the spans
    for (let j = 0; j < overallMeter.length; j++) {
      overallMeter[j].classList.remove("active");
    }
    // add the active class to the span that was clicked
    overallMeter[i].classList.add("active");
    reviewState.overall = parseInt(overallMeter[i].innerHTML);

    // if (reviewState.overall >= 2) {
    //   reviewState.accepted = "yes";
    // } else {
    //   reviewState.accepted = "no";
    // }

    reviewUpdateHandler(reviewState);
  });
}
const reviewUpdateHandler = async (review) => {
  const response = await fetch(`../../api/review/${review.review_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });
  const updatedReview = await response.json();
  localStorage["currentReview"] = JSON.stringify(updatedReview);
};

const strengthTextArea = document.querySelector(".strength textarea");
strengthTextArea.addEventListener("change", (event) => {
  reviewState.strength = event.target.value;
  reviewUpdateHandler(reviewState);
});
const weaknessTextArea = document.querySelector(".weakness textarea");
weaknessTextArea.addEventListener("change", (event) => {
  reviewState.weakness = event.target.value;
  reviewUpdateHandler(reviewState);
});
// when the submit button is clicked the done attribute of the review is set to true and the user is redirected to the reviewer page
const submitButton = document.querySelector("button:last-of-type");
submitButton.addEventListener("click", async () => {
  reviewState.done = "done";
  reviewUpdateHandler(reviewState);
  // Get all the reviews for the paper
  const response = await fetch(
    `../../api/review/${reviewState.paper_id}?type=paper`
  );
  const reviews = await response.json();

  // If both reviews are done
  if (reviews.length == 2) {
    const reviewOverall1 = parseInt(reviews[0].overall);
    const reviewOverall2 = parseInt(reviews[1].overall);
    // If overall sum is >= 2
    if (reviewOverall1 + reviewOverall2 >= 2) {
      reviews[0].accepted = "yes";
      reviews[1].accepted = "yes";
    } else {
      reviews[0].accepted = "no";
      reviews[1].accepted = "no";
    }
    // Update the reviews
    const response1 = await fetch(`../../api/review/${reviews[0].review_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviews[0]),
    });
    const response2 = await fetch(`../../api/review/${reviews[1].review_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviews[1]),
    });
  }

  // const response = await fetch(`../../api/paper/${reviewState.paper}`);
  // const paper = await response.json();
  // if (reviewState.accepted == "yes") {
  //   paper.status = true;
  // } else {
  //   paper.status = false;
  // }
  // const paperResponse = await fetch(`../../api/paper/${reviewState.paper}`, {
  //   method: "PUT",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(paper),
  // });
  // const updatedPaper = await paperResponse.json();

  window.location.href = "../reviewer.html";
});

// when the user clicks the download button it opens a new tab with the paper
const downloadButton = document.querySelector("button:first-of-type");
downloadButton.addEventListener("click", async () => {
  const paper = await getPapers(reviewState.paper_id);
  window.open(paper.document, "_blank");
});
