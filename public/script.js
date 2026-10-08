// Switch pages and highlight active navigation tab
function showPage(pageId, element) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active-link'));

    document.getElementById(pageId).classList.add('active');
    if (element) {
        element.classList.add('active-link');
    }
}

// 1. Handle Student Registration
async function handleStudentRegister(event) {
    event.preventDefault();

    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const studentData = {
        username: document.getElementById('reg-username').value,
        email: document.getElementById('reg-email').value,
        phone: document.getElementById('reg-phone').value,
        password: password,
        course: document.getElementById('reg-course').value,
        branch: document.getElementById('reg-branch').value,
        gender: document.getElementById('reg-gender').value,
        age: document.getElementById('reg-age').value
    };

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
    });

    const result = await response.json();
    alert(result.message);
    if (result.success) {
        document.getElementById('student-reg-form').reset();
    }
}

// 2. Handle Student Login
async function handleStudentLogin(event) {
    event.preventDefault();

    const loginData = {
        username: document.getElementById('login-username').value,
        password: document.getElementById('login-password').value
    };

    const response = await fetch('/api/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    });

    const result = await response.json();
    if (result.success) {
        const student = result.student;
        document.getElementById('student-login-section').style.display = 'none';
        document.getElementById('student-dashboard').style.display = 'block';
        document.getElementById('student-details').innerHTML = `
            <p><strong>Username:</strong> ${student.username}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Phone:</strong> ${student.phone}</p>
            <p><strong>Course:</strong> ${student.course}</p>
            <p><strong>Branch:</strong> ${student.branch}</p>
            <p><strong>Gender:</strong> ${student.gender}</p>
            <p><strong>Age:</strong> ${student.age}</p>
            <p><strong>Status:</strong> <span style="color: var(--accent-red);">${student.status}</span></p>
        `;
    } else {
        alert(result.message);
    }
}

// 3. Handle Admin Login
async function handleAdminLogin(event) {
    event.preventDefault();

    const loginData = {
        username: document.getElementById('admin-username').value,
        password: document.getElementById('admin-password').value
    };

    const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    });

    const result = await response.json();
    if (result.success) {
        document.getElementById('admin-login-section').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        loadAdminDashboardData();
    } else {
        alert(result.message);
    }
}

// 4. Fetch and Display Admin Dashboard Data
async function loadAdminDashboardData() {
    const response = await fetch('/api/admin/students');
    const data = await response.json();

    if (data.success) {
        document.getElementById('count-total').innerText = data.total;
        document.getElementById('count-active').innerText = data.active;
        document.getElementById('count-inactive').innerText = data.nonActive;

        const tbody = document.getElementById('student-table-body');
        tbody.innerHTML = '';

        data.students.forEach(s => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${s.id}</td>
                <td>${s.username}</td>
                <td>${s.email}</td>
                <td>${s.branch}</td>
                <td>${s.status}</td>
                <td>
                    <button class="btn-status" onclick="toggleStatus(${s.id}, '${s.status === 'active' ? 'inactive' : 'active'}')">
                        Set ${s.status === 'active' ? 'Inactive' : 'Active'}
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// 5. Toggle Student Active/Inactive Status
async function toggleStatus(studentId, newStatus) {
    const response = await fetch(`/api/admin/toggle-status/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });

    const result = await response.json();
    if (result.success) {
        loadAdminDashboardData();
    }
}