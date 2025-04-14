document.addEventListener("DOMContentLoaded", function () {
    const items = document.getElementById("category-menu");
    items.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "./category-manager.html";
    });

    const itemss = document.getElementById("category-pro");
    itemss.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "./category-manager.html";
    });

    const dashboardMenu = document.getElementById("dashboard-menu");
    dashboardMenu.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "./category-manager.html";
    });

    const modal = document.querySelector(".modal");
    const openModal = document.getElementById("myModal");
    const cancelButton = document.getElementById("cancelButton");
    const saveButton = document.getElementById("saveButton");
    const closeButtonAdd = document.getElementById("closeButtonAdd");

    openModal.addEventListener("click", function () {
        modal.style.display = "flex";
        document.getElementById("modal-title").textContent = "Thêm mới danh mục";
        document.getElementById("maDanhMuc").value = "";
        document.getElementById("tenDanhMuc").value = "";
        document.getElementById("dangHoatDong").checked = true;
    });

    cancelButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    closeButtonAdd.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    const editModal = document.querySelector(".edit-modal");
    const closeButtonEditModal = document.getElementById("closeButton");
    const cancelButtonEditModal = document.querySelector("#edit-modal .cancel-button");

    closeButtonEditModal.addEventListener("click", function () {
        editModal.style.display = "none";
    });

    if (cancelButtonEditModal) {
        cancelButtonEditModal.addEventListener("click", function () {
            editModal.style.display = "none";
        });
    } else {
        console.error("Không tìm thấy nút Hủy trong modal chỉnh sửa.");
    }

    window.onclick = function (event) {
        if (event.target === editModal) {
            editModal.style.display = "none";
        }
    };

    const logoutIcon = document.getElementById('logout-icon');
    logoutIcon.addEventListener('click', function () {
        const confirmLogout = confirm("Xác nhận đăng xuất?");
        if (confirmLogout) {
            window.location.href = './login.html';
        }
    });
    let categories = JSON.parse(localStorage.getItem("categories")) || [];

    let currentPage = 1;
    const itemsPerPage = 5;
    let sortOrder = "asc";

    function renderCategories() {
        const tableBody = document.getElementById("category-table-body");
        tableBody.innerHTML = "";

        const statusFilter = document.getElementById("status").value;
        const searchName = document.getElementById("search-name").value.toLowerCase();

        let filteredCategories = categories.filter(category => {
            const statusMatch = statusFilter === "" || category.status === statusFilter;
            const nameMatch = category.name.toLowerCase().includes(searchName);
            return statusMatch && nameMatch;
        });

        filteredCategories.sort((a, b) => {
            if (sortOrder === "asc") {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageCategories = filteredCategories.slice(startIndex, endIndex);

        pageCategories.forEach(category => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td class="${category.status}">${category.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}</td>
                <td>
                    <button class="delete" data-id="${category.id}">
                        <img src="/Project_Frontend_Fundamental/assets/delete.png" alt="Xóa">
                    </button>
                    <button class="edit-button" data-id="${category.id}">
                        <img src="/Project_Frontend_Fundamental/assets/fix.png" alt="Sửa">
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        renderPagination(filteredCategories.length);
        addEventListeners();
    }

    function showNotification(message) {
        const notification = document.getElementById("notification");
        const notificationMessage = document.getElementById("notification-message");

        notificationMessage.textContent = message;
        notification.style.display = "block";
        setTimeout(() => {
            notification.style.display = "none";
        }, 3000);
    }

    document.querySelector("th:nth-child(2)").addEventListener("click", function () {
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
        renderCategories();
    });

    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            li.className = "page-item";
            li.innerHTML = `<a href="#" class="page-link ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</a>`;
            pagination.appendChild(li);
        }
    }

    function addEventListeners() {
        document.querySelectorAll(".page-link").forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                currentPage = parseInt(this.dataset.page);
                renderCategories();
            });
        });

        document.querySelectorAll(".delete").forEach(button => {
            button.addEventListener("click", function () {
                const id = this.dataset.id;
                const confirmDelete = confirm("Xác nhận xóa danh mục?");
                if (confirmDelete) {
                    categories = categories.filter(category => category.id !== id);
                    localStorage.setItem("categories", JSON.stringify(categories)); 
                    showNotification("Xóa danh mục thành công!");
                    renderCategories();
                }
            });
        });

        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", function () {
                const id = this.dataset.id;
                const category = categories.find(category => category.id === id);
                if (category) {
                    document.getElementById("edit-modal").style.display = "flex";
                    document.getElementById("categoryCode").value = category.id;
                    document.getElementById("categoryName").value = category.name;
                    document.getElementById(category.status === "active" ? "statusActive" : "statusInactive").checked = true;
                    document.getElementById("edit-form").dataset.id = id;
                }
            });
        });
    }

    document.getElementById("edit-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const id = this.dataset.id;
        const name = document.getElementById("categoryName").value;
        const status = document.querySelector('input[name="categoryStatus"]:checked').value;
        if (!name) {
            showNotification("Tên danh mục không được để trống!");
            return;
        }
        if (categories.some(category => category.name === name && category.id !== id)) {
            showNotification("Tên danh mục đã tồn tại!");
            return;
        }
        const categoryIndex = categories.findIndex(category => category.id === id);
        if (categoryIndex !== -1) {
            categories[categoryIndex].name = name;
            categories[categoryIndex].status = status;
            localStorage.setItem("categories", JSON.stringify(categories)); 
            showNotification("Cập nhật danh mục thành công!");
            renderCategories();
            document.getElementById("edit-modal").style.display = "none";
            
        }
    });

    saveButton.addEventListener("click", function () {
        const id = document.getElementById("maDanhMuc").value;
        const name = document.getElementById("tenDanhMuc").value;
        const status = document.querySelector('input[name="trangThai"]:checked').value;
        if (!id) {
            showNotification("Mã danh mục không được để trống!");
            return;
        }
        if (categories.some(category => category.id === id)) {
            showNotification("Mã danh mục đã tồn tại!");
            return;
        }

        // Kiểm tra tên danh mục
        if (!name) {
            showNotification("Tên danh mục không được để trống!");
            return;
        }
        if (categories.some(category => category.name === name)) {
            showNotification("Tên danh mục đã tồn tại!");
            return;
        }
        categories.push({ id, name, status });
        localStorage.setItem("categories", JSON.stringify(categories));
        showNotification("Thêm mới danh mục thành công!");
        modal.style.display = "none";
        renderCategories();
    });


    document.getElementById("status").addEventListener("change", renderCategories);
    document.getElementById("search-name").addEventListener("input", renderCategories);

    renderCategories();

});

