window.onload = async () => {
  await userDisplayer();
}; 

let paperState = {
  title: "",
  abstract: "",
  authors: [],
  document: "",
};
const addAuthorButton = document.querySelector("#add-authors");
addAuthorButton.addEventListener("click", async () => {
  const authorName = document.querySelector(".search-div input").value;
  const response = await fetch("../api/user?author");
  const data = await response.json();
  const author = data.find(
    (author) =>
      author.first_name.toLowerCase() === authorName.toLowerCase() ||
      author.last_name.toLowerCase() === authorName.toLowerCase() ||
      author.first_name.toLowerCase() + " " + author.last_name.toLowerCase() ===
        authorName.toLowerCase() ||
      author.last_name.toLowerCase() + " " + author.first_name.toLowerCase() ===
        authorName.toLowerCase()
  );
  if (author) {
    if (uniqueAuthors(authorName)) {
      const authorSpan = await createAuthor(
        `${author.last_name}, ${author.first_name}`,
        author
      );
      const authorContainer = document.querySelector(".author-names");
      authorContainer.appendChild(authorSpan);
      paperState.authors.push({
        name: `${author.first_name} ${author.last_name}`,
        email: author.email,
        affiliation: "",
        main: false,
      });
      document.querySelector(".search-div input").value = "";
    } else {
      document.querySelector(".search-div input").value = "";
      alert("Author already added");
      return;
    }
  } else {
    document.querySelector(".search-div input").value = "";
    alert("Author not found");
    return;
  }
});
const titleInput = document.querySelector("#title");
titleInput.addEventListener("change", (e) => {
  paperState.title = e.target.value;
});
const abstractInput = document.querySelector("#abstract");
abstractInput.addEventListener("change", (e) => {
  paperState.abstract = e.target.value;
});
const linkInput = document.querySelector("#document");
linkInput.addEventListener("change", (e) => {
  paperState.document = e.target.value;
});
const createAuthor = async (authorName, author) => {
  const containerSpan = document.createElement("span");
  containerSpan.classList.add("author-span");
  containerSpan.innerHTML = authorName;
  containerSpan.addEventListener("click", async (e) => {
    if (e.target.classList.contains("author-span")) {
      const popup = await authorInfo(
        `${author.first_name} ${author.last_name}`
      );
      var rect = containerSpan.getBoundingClientRect();
      var x = rect.left;
      var y = rect.bottom - 100;
      popup.style.left = x + "px";
      popup.style.top = y + "px";
      containerSpan.appendChild(popup);
    }
    window.addEventListener("resize", (e) => {
      movePopup(containerSpan);
    });
  });
  return containerSpan;
};
const uniqueAuthors = (authorName) => {
  const authorNames = document.querySelectorAll(".author-span");
  const authorNamesArray = Array.from(authorNames).map((author) => {
    const authorName = author.innerHTML.split(", ");
    return {
      first_name: authorName[1],
      last_name: authorName[0],
    };
  });
  let unique = true;
  authorNamesArray.forEach((author) => {
    if (
      author.first_name.toLowerCase() === authorName.toLowerCase() ||
      author.last_name.toLowerCase() === authorName.toLowerCase() ||
      author.first_name.toLowerCase() + " " + author.last_name.toLowerCase() ===
        authorName.toLowerCase() ||
      author.last_name.toLowerCase() + " " + author.first_name.toLowerCase() ===
        authorName.toLowerCase()
    ) {
      unique = false;
    }
  });
  return unique;
};
const authorInfo = async (authorName) => {
  const author = paperState.authors.find(
    (author) => author.name === authorName
  );
  const containerDiv = document.createElement("div");
  containerDiv.classList.add("popup");
  const removePopupIcon = document.createElement("img");
  removePopupIcon.addEventListener("click", () => {
    containerDiv.remove();
  });
  removePopupIcon.src = "../recourses/icons/xmark-solid.svg";
  removePopupIcon.classList.add("remove-popup");
  const authorNameInput = document.createElement("input");
  authorNameInput.value = author.name;
  const authorEmailInput = document.createElement("input");
  authorEmailInput.value = author.email;
  authorNameInput.disabled = true;
  authorNameInput.classList.add("disabled");
  authorEmailInput.classList.add("disabled");
  authorEmailInput.disabled = true;
  const authorAffiliationSelect = document.createElement("select");
  const response = await fetch("../api/institution");
  const data = await response.json();
  const option = document.createElement("option");
  option.value = "";
  option.innerHTML = "Pick Institution";
  authorAffiliationSelect.appendChild(option);
  data.forEach((institution) => {
    const option = document.createElement("option");
    option.value = institution;
    option.innerHTML = institution;
    authorAffiliationSelect.appendChild(option);
  });
  authorAffiliationSelect.value = author.affiliation;
  const nameLabel = document.createElement("label");
  nameLabel.innerHTML = "Name";
  const emailLabel = document.createElement("label");
  emailLabel.innerHTML = "Email";
  const affiliationLabel = document.createElement("label");
  affiliationLabel.innerHTML = "Affiliation";
  const mainAuthorLabel = document.createElement("label");
  mainAuthorLabel.innerHTML = "Mark as Presenter";
  const mainAuthorInput = document.createElement("input");
  mainAuthorInput.type = "radio";
  mainAuthorInput.checked = author.main;
  mainAuthorInput.addEventListener("change", () => {
    paperState.authors.forEach((author) => {
      author.main = false;
    });
    author.main = true;
  });
  authorAffiliationSelect.addEventListener("change", (e) => {
    author.affiliation = e.target.value;
  });
  const removeAuthorButton = document.createElement("button");
  removeAuthorButton.innerHTML = "Remove Author";
  removeAuthorButton.classList.add("remove-author");
  removeAuthorButton.addEventListener("click", () => {
    containerDiv.remove();
    removeAuthor(authorName);
  });
  mainAuthorContainer = document.createElement("div");
  mainAuthorContainer.classList.add("main-author-container");
  roundDiv = document.createElement("div");
  roundDiv.classList.add("round");
  const authorMainState = author.main ? "checked" : "";
  roundDiv.innerHTML = `<input type="checkbox" ${authorMainState} id="checkbox" />
    <label for="checkbox"></label>`;
  roundDiv.addEventListener("click", (e) => {
    if (e.target === document.querySelector(".round label")) {
      return;
    }
    paperState.authors.forEach((author) => {
      if (author.name === authorName) {
        author.main = author.main ? false : true;
      } else {
        author.main = false;
      }
    });
  });
  mainAuthorContainer.appendChild(roundDiv);
  mainAuthorContainer.appendChild(mainAuthorLabel);
  containerDiv.appendChild(removePopupIcon);
  containerDiv.appendChild(nameLabel);
  containerDiv.appendChild(authorNameInput);
  containerDiv.appendChild(emailLabel);
  containerDiv.appendChild(authorEmailInput);
  containerDiv.appendChild(affiliationLabel);
  containerDiv.appendChild(authorAffiliationSelect);
  containerDiv.appendChild(mainAuthorContainer);
  containerDiv.appendChild(removeAuthorButton);
  return containerDiv;
};

const removeAuthor = (authorName) => {
  paperState.authors = paperState.authors.filter(
    (author) => author.name !== authorName
  );
  let authorMatchingName = authorName.split(" ");
  authorMatchingName = authorMatchingName[1] + ", " + authorMatchingName[0];
  const authorSpan = document.querySelectorAll(".author-span");
  authorSpan.forEach((span) => {
    if (
      span.innerHTML === authorName ||
      span.innerHTML === authorMatchingName
    ) {
      span.remove();
    }
  });
};

const submitButton = document.querySelector("input[type='submit']");
submitButton.addEventListener("click", async (e) => {
  e.preventDefault();
  if (validPaper(paperState)) {
    const response = await fetch("../api/paper", {
      method: "POST",
      body: JSON.stringify(await paperStateModifier(paperState)),
    });
    const data = await response.json();
    if (data.id) {
      const review = await makeAReview(data.id);
      console.log(review);
      window.location.reload();
    }
  } else {
    alert("Please fill out all the fields");
  }
});
const validPaper = (paper) => {
  const { title, abstract, authors, document } = paper;
  // check that all the fields are filled and check that all the information is valid and all the author info is filled out
  if (
    title &&
    abstract &&
    authors.length > 0 &&
    document &&
    validAuthors(authors)
  ) {
    return true;
  }
  return false;
};
const validAuthors = (authors) => {
  // the main author is required only for one author
  let mainAuthor = false;
  authors.forEach((author) => {
    if (author.main) {
      mainAuthor = true;
    }
  });
  if (!mainAuthor) {
    return false;
  }
  // check that all the authors have a name and email
  authors.forEach((author) => {
    if (!author.name || !author.email) {
      return false;
    }
  });
  return true;
};

// make a function that replaces the author name in the paper state with the their id instead
const paperStateModifier = async (paperState) => {
  const response = await fetch("../api/user?author");
  const data = await response.json();
  // create a new object that will be sent to the server
  const newPaperState = {};
  newPaperState.title = paperState.title;
  newPaperState.abstract = paperState.abstract;
  newPaperState.authors = [];
  newPaperState.document = paperState.document;

  paperState.authors.forEach((author) => {
    const authorObject = {};
    authorObject.email = author.email;
    authorObject.affiliation = author.affiliation;
    authorObject.main = author.main;
    data.forEach((user) => {
      if (`${user.first_name} ${user.last_name}` === author.name) {
        authorObject.id = user.id;
      }
    });
    newPaperState.authors.push(authorObject);
  });
  newPaperState.status = false;
  return newPaperState;
};

const makeAReview = async (paperId) => {
  const response = await fetch("../api/user?reviewer");
  const data = await response.json();
  // select two random reviewers but their id's into an array
  const reviewers = [];
  while (reviewers.length < 2) {
    const randomReviewer = data[Math.floor(Math.random() * data.length)];
    if (!reviewers.includes(randomReviewer.id)) {
      reviewers.push(randomReviewer.id);
    }
  }
  const review = {
    paper: paperId,
    reviewers: reviewers,
    done: false,
    overall: 0,
    contribution: 0,
    strength: "",
    weakness: "",
    accepted: false,
  };
  const reviewResponse = await fetch("../api/review", {
    method: "POST",
    body: JSON.stringify(review),
  });
  const reviewData = await reviewResponse.json();
  return reviewData;
};
const movePopup = (span) => {
  const rect = span.getBoundingClientRect();
  var x = rect.left;
  var y = rect.bottom - 100;
  var popup = document.querySelector(".popup");
  popup.style.left = x + "px";
  popup.style.top = y + "px";
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
    logoutImage.src = "../recourses/icons/Vector2.svg";
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
      // redirect to organizer page
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
