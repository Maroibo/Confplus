const password = document.querySelector("#password");
const email = document.querySelector("#email");
const togglePassword = document.querySelector("#visiblity");
const loginBtn = document.getElementsByTagName("button")[0];

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector("#email").focus();
});

togglePassword.addEventListener("click", function () {
  // toggle the type attribute
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
});

loginBtn.addEventListener("click", async () => await handleLogin());

email.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    loginBtn.click();
  }
});

password.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    loginBtn.click();
  }
});

async function handleLogin() {
  let emailVal = email.value;
  let passwordVal = password.value;
  let response = await fetch(`/api/user/auth/${emailVal}/${passwordVal}`);
  let results = await response.json();
  if (!results.user) {
    alert("Invalid email or password");
    return;
  }
  results = results.user;
  localStorage["currentUser"] = `${results.user_id}`;
  if (results.author.length !== 0)
    window.location.href = "../Author/author-home/author-home.html";
  else if (results.organizer.length !== 0)
    window.location.href = "../homepage/index.html";
  else if (results.reviewer.length !== 0)
    window.location.href = "../Reviewer/reviewer.html";
}
