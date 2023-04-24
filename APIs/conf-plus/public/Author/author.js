let paperState = {
  title: "",
  abstract: "",
  authors: [],
  link: "",
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
      const authorSpan = createAuthor(
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
const titleInpue = document.querySelector("#title");
titleInpue.addEventListener("change", (e) => {
  paperState.title = e.target.value;
});
const abstractInput = document.querySelector("#abstract");
abstractInput.addEventListener("change", (e) => {
  paperState.abstract = e.target.value;
});
const linkInput = document.querySelector("#document");
linkInput.addEventListener("change", (e) => {
  paperState.link = e.target.value;
});
const createAuthor = (authorName, author) => {
  const containerSpan = document.createElement("span");
  containerSpan.classList.add("author-span");
  containerSpan.innerHTML = authorName;
  containerSpan.addEventListener("click", () => {
    const popup = authorInfo(`${author.first_name} ${author.last_name}`);
    var rect = containerSpan.getBoundingClientRect();
    var x = rect.left + 20;
    var y = rect.bottom + 50;
    popup.style.left = x + "px";
    popup.style.top = y + "px";
    containerSpan.appendChild(popup);
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
const authorInfo = (authorName) => {
  const author = paperState.authors.find(
    (author) => author.name === authorName
  );
  const containerDiv = document.createElement("div");
  containerDiv.classList.add("popup");
  const authorNameInput = document.createElement("input");
  authorNameInput.value = author.name;
  const authorEmailInput = document.createElement("input");
  authorEmailInput.value = author.email;
  authorNameInput.disabled = true;
  authorNameInput.classList.add("disabled");
  authorEmailInput.classList.add("disabled");
  authorEmailInput.disabled = true;
  const authorAffiliationInput = document.createElement("input");
  const nameLabel = document.createElement("label");
  nameLabel.innerHTML = "Name";
  const emailLabel = document.createElement("label");
  emailLabel.innerHTML = "Email";
  const affiliationLabel = document.createElement("label");
  affiliationLabel.innerHTML = "Affiliation";
  const mainAuthorLabel = document.createElement("label");
  mainAuthorLabel.innerHTML = "Mark as Presenter";
  const mainAuthorInput = document.createElement("input");
  mainAuthorInput.type = "checkbox";
  mainAuthorInput.checked = author.main;
  mainAuthorInput.addEventListener("change", () => {
    paperState.authors.forEach((author) => {
      author.main = false;
    });
    author.main = true;
  });
  authorAffiliationInput.addEventListener("change", (e) => {
    author.affiliation = e.target.value;
  });
  const removeAuthorButton = document.createElement("button");
  removeAuthorButton.innerHTML = "Remove Author";
  removeAuthorButton.classList.add("remove-author");
  removeAuthorButton.addEventListener("click", () => {
    paperState.authors = paperState.authors.filter(
      (author) => author.name !== authorName
    );
    containerDiv.remove();
  });
  mainAuthorContainer = document.createElement("div");
    mainAuthorContainer.classList.add("main-author-container");
  mainAuthorContainer.appendChild(mainAuthorInput);
  mainAuthorContainer.appendChild(mainAuthorLabel);
  containerDiv.appendChild(nameLabel);
  containerDiv.appendChild(authorNameInput);
  containerDiv.appendChild(emailLabel);
  containerDiv.appendChild(authorEmailInput);
  containerDiv.appendChild(affiliationLabel);
  containerDiv.appendChild(authorAffiliationInput);
  containerDiv.appendChild(mainAuthorContainer);
  containerDiv.appendChild(removeAuthorButton);
  return containerDiv;
};
document.addEventListener("click", (e) => removePopup(e));
const removePopup = (event) => {
  if (typeof document.querySelector(".popup") !== "undefined") return;
  const popup = document.querySelector(".popup");
  if (popup.contains(event.target)) return;
  popup.remove();
};
