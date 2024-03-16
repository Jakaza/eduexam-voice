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
  const identification_number = document.querySelector('#login-form input[name="identification_number"]').value;
  const password = document.querySelector('#login-form input[name="password"]').value;

  document.querySelectorAll(".oq-error").forEach((errorSpan) => {
    errorSpan.textContent = "";
  });

  let isValid = true;

  // Validate password length
  if (password.length < 6) {
    document.querySelector("#passerror").textContent = "Password must be at least 6 characters long";
    isValid = false;
  }

  // Validate identification number format (8 digits starting with 22 and no letters)
  if (!/^(22\d{6})$/.test(identification_number) || /[a-zA-Z]/.test(identification_number)) {
    document.querySelector("#iderror").textContent = "Identification number must be 8 digits contain no letters";
    isValid = false;
  }

  return isValid;
}
