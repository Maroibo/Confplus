document
  .getElementsByTagName("button")[0]
  .addEventListener("click", async () => {
    let emailVal = document.getElementById("email").value;
    let passwordVal = document.getElementById("password").value;
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
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      return;
    }
    localStorage["currentUser"] = `${target.id}`;
    // redirect to home page
  });
let togglePassword = document.getElementById("visiblity");
togglePassword.addEventListener("click", function () {
  // toggle the type attribute
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
});

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("email").focus();
});
