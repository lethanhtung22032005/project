document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        resetErrors();

        let isValid = true;

        if (!email) {
            displayError(emailInput, emailError, 'Email hoặc mật khẩu không đúng.');
            isValid = false;
        }

        if (!password) {
            displayError(passwordInput, passwordError, 'Email hoặc mật khẩu không đúng.');
            isValid = false;
        }

        if (isValid) {
            // Lấy dữ liệu đăng ký từ localStorage
            const registeredEmails = JSON.parse(localStorage.getItem('registeredEmails')) || [];
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {};

            // Kiểm tra email và mật khẩu
            if (registeredEmails.includes(email) && registeredUsers[email] === password) {
                // Đăng nhập thành công
                window.location.href = './dashboard.html';
            } else {
                // Đăng nhập thất bại
                displayError(emailInput, emailError, 'Email hoặc mật khẩu không đúng.');
                displayError(passwordInput, passwordError, 'Email hoặc mật khẩu không đúng.');
            }
        }
    });

    function displayError(inputElement, errorElement, errorMessage) {
        errorElement.textContent = errorMessage;
        inputElement.classList.add('error');
    }

    function resetErrors() {
        emailError.textContent = '';
        passwordError.textContent = '';
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
    }
});