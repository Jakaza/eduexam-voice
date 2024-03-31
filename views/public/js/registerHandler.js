function errorMessage(message) {
  document.querySelector("#server-error").textContent = `${message}`;
  isValid = false;
}

document
  .getElementById("register-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const registerBtn = document.getElementById("register-btn");

    if (!validateForm()) {
      return;
    }

    const form = document.getElementById("register-form");
    const formData = new FormData(form);
    const jsonFormData = {};
    let nameEmpty = true;

    formData.forEach((value, key) => {
      console.log(value.trim());
      if (
        key === "first_name" ||
        key === "last_name" ||
        key === "rsa_id" ||
        key === "phone_number" ||
        key === "user_address" ||
        key === "password_hash" ||
        key === "userrepass"
      ) {
        if (value.trim().length <= 3 || value.trim() == "") {
          errorMessage("Please enter valid input");
          nameEmpty = true;
        } else {
          nameEmpty = false;
        }
      }
      jsonFormData[key] = value.trim();
    });

    if (nameEmpty) {
      registerBtn.disabled = false;
      registerBtn.value = "Create Account";
      return;
    }

    // Show loading indicator
    registerBtn.disabled = true;
    registerBtn.value = "Creating New Account...";

    const additionalData = {
      user_role: document.querySelector(
        '#register-form select[name="user_role"]'
      ).value,
      course_id: document.querySelector(
        '#register-form select[name="course_id"]'
      ).value,
    };

    const postData = { ...jsonFormData, ...additionalData };

    fetch("/auth/register", {
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
          swal(
            `Account has been created, Check your email ${additionalData.user_role.toLowerCase()} number`,
            "Click ok to login",
            "success"
          ).then((value) => {
            window.location.href = `/`;
          });
        } else {
          registerBtn.disabled = false;
          registerBtn.value = "Create Account";
          document.querySelector(
            "#server-error"
          ).textContent = `${data.message}`;
        }
      })
      .catch((error) => {
        // Handle errors
        registerBtn.disabled = false;
        registerBtn.value = "Create Account";
        console.log(error);
        document.querySelector("#server-error").textContent =
          "There was a problem with the register operation: try again";
      });
  });

function validateForm() {
  const first_name = document.querySelector(
    '#register-form input[name="first_name"]'
  ).value;
  const last_name = document.querySelector(
    '#register-form input[name="last_name"]'
  ).value;
  const rsaId = document.querySelector(
    '#register-form input[name="rsa_id"]'
  ).value;
  const email = document.querySelector(
    '#register-form input[name="email"]'
  ).value;
  const phone_number = document
    .querySelector('#register-form input[name="phone_number"]')
    .value.trim();
  const password = document.querySelector(
    '#register-form input[name="password_hash"]'
  ).value;
  const confirmPassword = document.querySelector(
    '#register-form input[name="userrepass"]'
  ).value;
  const user_role = document.querySelector(
    '#register-form select[name="user_role"]'
  ).value;
  const course_id = document.querySelector(
    '#register-form select[name="course_id"]'
  ).value;

  document.querySelectorAll(".oq-error").forEach((errorSpan) => {
    errorSpan.textContent = "";
  });

  let isValid = true;

  if (!first_name.trim().match(/^[a-zA-Z\s]+$/)) {
    document.querySelector("#nameerror").textContent =
      "Invalid name (only letters and spaces allowed)";
    isValid = false;
  }

  if (!last_name.match(/^[a-zA-Z\s]+$/)) {
    document.querySelector("#adderror").textContent =
      "Invalid surname (only letters and spaces allowed)";
    isValid = false;
  }

  const phoneNumberPattern = /^\d{10}$/;

  if (!phoneNumberPattern.test(phone_number)) {
    document.querySelector("#phoneerror").textContent =
      "Invalid surname (only letters and spaces allowed)";
    isValid = false;
  }

  if (!rsaId.match(/^\d{13}$/)) {
    document.querySelector("#cityerror").textContent =
      "Invalid ID Number (13 digits required)";
    isValid = false;
  }

  if (!email.match(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)) {
    document.querySelector("#phoneerror").textContent = "Invalid email address";
    isValid = false;
  }

  if (password.length < 6) {
    document.querySelector("#passerror").textContent =
      "Password must be at least 6 characters long";
    isValid = false;
  }

  if (password !== confirmPassword) {
    document.querySelector("#repasserror").textContent =
      "Passwords do not match";
    isValid = false;
  }

  if (user_role === "") {
    alert("Please select a role");
    isValid = false;
  }

  if (course_id === "") {
    alert("Please select a course");
    isValid = false;
  }

  return isValid;
}
