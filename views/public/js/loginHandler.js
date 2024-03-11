document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const loginBtn = document.getElementById("login");

  if (!validateLoginForm()) {
    return;
  }
    // Show loading indicator
    loginBtn.disabled = true;
    loginBtn.value = "Logging In...";
    
  const form = document.getElementById("login-form");
  const formData = new FormData(form);
  const jsonFormData = {};
  formData.forEach((value, key) => {
    jsonFormData[key] = value;
  });
  const postData = { ...jsonFormData };

  fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status === true) {
        window.location.href = "/";
      } else {
        document.getElementById("login-error-msg").textContent = `${data.message}`
        loginBtn.disabled = false;
        loginBtn.value = "Login";
      }
    })
    .catch((error) => {
      // Handle errors
      loginBtn.disabled = false;
      console.log(error);
      loginBtn.value = "Login";
      document.getElementById("login-error-msg").textContent =
        "Something went wrong... try again";
    });
});


function validateLoginForm() {
  const email = document.querySelector('#login-form input[name="email"]').value;
  const password = document.querySelector(
    '#login-form input[name="password"]'
  ).value;

  document.querySelectorAll(".oq-error").forEach((errorSpan) => {
    errorSpan.textContent = "";
  });

  let isValid = true;

  if (!email.match(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)) {
    document.querySelector("#phoneerror").textContent = "Invalid email address";
    isValid = false;
  }

  if (password.length < 5) {
    document.querySelector("#passerror").textContent =
      "Password must be at least 6 characters long";
    isValid = false;
  }

  return isValid;
}
