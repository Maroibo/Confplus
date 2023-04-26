document
  .getElementsByTagName("button")[0]
  .addEventListener("click", async () => {
    let emailVal = document.querySelector("#email").value;
    let passwordVal = document.querySelector("#password").value;
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
      document.querySelector("#email").value = "";
      document.querySelector("#password").value = "";
      return;
    }
    localStorage["currentUser"] = `${results.target.id}`;
    if (results.target.role === "author")
      window.location.href = "../Author/author.html";
    else if (results.target.role === "organizer")
      window.location.href = "../conference-schedule/confrence-schedule.html";
    else
      window.location.href = "../conference-schedule/confrence-schedule.html";
  });
let togglePassword = document.querySelector("#visiblity");
togglePassword.addEventListener("click", function () {
  // toggle the type attribute
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
});

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector("#email").focus();
});
