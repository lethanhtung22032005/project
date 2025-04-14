document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const fullNameInput = document.getElementById('full-name');
    const firstNameInput = document.getElementById('first-name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const agreeCheckbox = document.getElementById('agree');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');

    form.addEventListener('submit', function (event) {
        let isValid = true;
        const registeredEmails = JSON.parse(localStorage.getItem('registeredEmails')) || [];
        if (registeredEmails.includes(emailInput.value.trim())) {
            isValid = false;
            alert('Email này đã được đăng ký. Vui lòng sử dụng email khác.');
        }

        if (fullNameInput.value.trim() === "") {
            isValid = false;
            alert('Họ và tên đệm không được để trống.');
        }

        if (firstNameInput.value.trim() === "") {
            isValid = false;
            alert('Tên không được để trống.');
        }

        if (emailInput.value.trim() === "") {
            isValid = false;
            alert('Email không được để trống.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            isValid = false;
            alert('Email không đúng định dạng.');
        }

        if (passwordInput.value === "") {
            isValid = false;
            passwordError.textContent = 'Mật khẩu không được để trống.';
        } else {
            passwordError.textContent = '';
        }

        if (passwordInput.value.length < 8) {
            isValid = false;
            passwordError.textContent = 'Mật khẩu phải có ít nhất 8 ký tự.';
        }

        if (confirmPasswordInput.value === "") {
            isValid = false;
            confirmPasswordError.textContent = 'Xác nhận mật khẩu không được để trống.';
        } else {
            confirmPasswordError.textContent = '';
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            isValid = false;
            confirmPasswordError.textContent = 'Mật khẩu không trùng khớp.';
        }

        if (!agreeCheckbox.checked) {
            isValid = false;
            alert('Bạn cần đồng ý với chính sách và điều khoản.');
        }

        if (!isValid) {
            event.preventDefault();
        } else {
            event.preventDefault();
            const registeredEmails = JSON.parse(localStorage.getItem('registeredEmails')) || [];
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {};

            registeredEmails.push(emailInput.value.trim());
            registeredUsers[emailInput.value.trim()] = passwordInput.value; // Lưu email và mật khẩu

            localStorage.setItem('registeredEmails', JSON.stringify(registeredEmails));
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

            // // "users": [
            //     {
            //         "id": 1,
            //         "firstName": "John",
            //         "lastName": "Doe",
            //         "gender": "0",
            //         "date_of_birth": "2000-01-01",
            //         "address": "123 Main St",
            //     }
            // ]
            // const users = JSON.parse(localStorage.getItem('users')) || []; // Lưu danh sách người dùngUsers

            alert('Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.');
            window.location.href = 'login.html?registration=success';
        }
    });
});