const password = document.querySelector("#password");
const email = document.querySelector("#email");
const togglePassword = document.querySelector("#visiblity");
const loginBtn = document.getElementsByTagName("button")[0];

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector("#email").focus();
});

togglePassword.addEventListener("click", function () {
  // toggle the type attribute
  const type = password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
});

loginBtn.addEventListener("click", async () => await handleLogin());

email.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    loginBtn.click();
  }
});

password.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    loginBtn.click();
  }
});

async function handleLogin() {
  let emailVal = email.value;
    let passwordVal = password.value;
    const response = await fetch("../api/user");
    const users = await response.json();
    let results = users.reduce(
      (acc, obj) => {
        acc.found = obj.email === emailVal && obj.password == passwordVal;
        if (obj.email === emailVal && obj.password == passwordVal)
          acc.target = obj;
        return acc;
      },
      { found: false, target: {} }
    );


    if (Object.keys(results.target).length === 0) {
      window.alert("Email or Password are incorrect");
      email.value = "";
      password.value = "";
      return;
    }
    localStorage["currentUser"] = `${results.target.id}`;
    if (results.target.role === "author")
      window.location.href = "../Author/author.html";
    else if (results.target.role === "organizer")
      window.location.href = "../homepage/index.html";
    else if (results.target.role === "reviewer")
      window.location.href = "../Reviewer/reviewer.html";
}

