document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }
    const form = document.getElementById('register-form');
    const formData = new FormData(form);
    const jsonFormData = {};
    formData.forEach((value, key) => {
        jsonFormData[key] = value;
    });

    const additionalData = {
        user_role: document.querySelector('#register-form select[name="user_role"]').value,
        course_id: document.querySelector('#register-form select[name="course_id"]').value
    };

    const postData = { ...jsonFormData, ...additionalData };


    
    fetch('http://localhost:5000/auth/register', {
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
                window.location.href = `/login?isNewUser=true`;
              } else {
                document.querySelector('#server-error').textContent = `${data.message}`
              }
        })
        .catch(error => {
            // Handle errors
            document.querySelector('#server-error').textContent =
                'There was a problem with the register operation: try again';
        });
});

function validateForm() {
    const first_name = document.querySelector('#register-form input[name="first_name"]').value;
    const last_name = document.querySelector('#register-form input[name="last_name"]').value;
    const rsaId = document.querySelector('#register-form input[name="rsa_id"]').value;
    const email = document.querySelector('#register-form input[name="email"]').value;
    const password = document.querySelector('#register-form input[name="password_hash"]').value;
    const confirmPassword = document.querySelector('#register-form input[name="userrepass"]').value;
    const user_role = document.querySelector('#register-form select[name="user_role"]').value;
    const course_id = document.querySelector('#register-form select[name="course_id"]').value;

    document.querySelectorAll('.oq-error').forEach(errorSpan => {
        errorSpan.textContent = '';
    });

    let isValid = true;

    if (!first_name.match(/^[a-zA-Z\s]+$/)) {
        document.querySelector('#nameerror').textContent = 'Invalid name (only letters and spaces allowed)';
        isValid = false;
    }

    if (!last_name.match(/^[a-zA-Z\s]+$/)) {
        document.querySelector('#adderror').textContent = 'Invalid surname (only letters and spaces allowed)';
        isValid = false;
    }

    if (!rsaId.match(/^\d{13}$/)) {
        document.querySelector('#cityerror').textContent = 'Invalid ID Number (13 digits required)';
        isValid = false;
    }

    if (!email.match(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)) {
        document.querySelector('#phoneerror').textContent = 'Invalid email address';
        isValid = false;
    }

    if (password.length < 6) {
        document.querySelector('#passerror').textContent = 'Password must be at least 6 characters long';
        isValid = false;
    }

    if (password !== confirmPassword) {
        document.querySelector('#repasserror').textContent = 'Passwords do not match';
        isValid = false;
    }

    if (user_role === '') {
        alert('Please select a role');
        isValid = false;
    }

    if (course_id === '') {
        alert('Please select a course');
        isValid = false;
    }

    return isValid;
}
