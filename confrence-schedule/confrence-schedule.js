window.onload = () => {
  emptyPageScreen();
};

let emptyPageScreen = () => {
  let container = document.createElement("div");
  let mainImage = document.createElement("img");
  mainImage.src = "../recourses/Group 26649.svg";
  let text = document.createElement("p");
  text.innerHTML = "There are still no plans for this confrence";
  container.classList += "empty-contianer";
  container.appendChild(mainImage);
  container.appendChild(text);
  console.log(text);
  document.getElementsByClassName("root")[0].appendChild(container);
};
