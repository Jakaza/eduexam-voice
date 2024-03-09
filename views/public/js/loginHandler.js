document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateLoginForm()) {
        return;
    }

    const form = document.getElementById('loginForm');
    const formData = new FormData(form);

    const jsonFormData = {};
    formData.forEach((value, key) => {
        jsonFormData[key] = value;
    });

    const postData = { ...jsonFormData };

    fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === true) {
                window.location.href = "/";
            } else {
                document.querySelector('#welcome-message').textContent = `${data.message}`;
                document.querySelector('#welcome-message').style.display = "block";
            }
        })
        .catch(error => {
            // Handle errors
            document.querySelector('#server-error').textContent =
                'There was a problem with the login operation: try again';
        });
});

function validateLoginForm() {
    const email = document.querySelector('#loginForm input[name="email"]').value;
    const password = document.querySelector('#loginForm input[name="password"]').value;

    document.querySelectorAll('.oq-error').forEach(errorSpan => {
        errorSpan.textContent = '';
    });

    let isValid = true;

    if (!email.match(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)) {
        document.querySelector('#phoneerror').textContent = 'Invalid email address';
        isValid = false;
    }

    if (password.length < 5) {
        document.querySelector('#passerror').textContent = 'Password must be at least 6 characters long';
        isValid = false;
    }

    return isValid;
}
