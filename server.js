const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Update with your MySQL username
    password: 'root123',  // Update with your MySQL password
    database: 'student_portal_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL Database.');
    }
});

// API 1: Register a new student
app.post('/api/register', (req, res) => {
    const { username, email, phone, password, course, branch, gender, age } = req.body;
    const query = `INSERT INTO students (username, email, phone, password, course, branch, gender, age) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [username, email, phone, password, course, branch, gender, age], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Registration failed or email already exists.' });
        }
        res.json({ success: true, message: 'Registration successful!' });
    });
});

// API 2: Student Login
app.post('/api/student-login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM students WHERE username = ? AND password = ?`;

    db.query(query, [username, password], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid Student Credentials' });
        }
        res.json({ success: true, student: results[0] });
    });
});

// API 3: Admin Login
app.post('/api/admin-login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM admins WHERE username = ? AND password = ?`;

    db.query(query, [username, password], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid Admin Credentials' });
        }
        res.json({ success: true, message: 'Admin login successful' });
    });
});

// API 4: Get All Students and Counts (for Admin Dashboard)
app.get('/api/admin/students', (req, res) => {
    const query = `SELECT * FROM students`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error fetching data' });
        }
        const total = results.length;
        const active = results.filter(s => s.status === 'active').length;
        const nonActive = results.filter(s => s.status !== 'active').length;

        res.json({
            success: true,
            total,
            active,
            nonActive,
            students: results
        });
    });
});

// API 5: Toggle Student Status (Admin Operation)
app.put('/api/admin/toggle-status/:id', (req, res) => {
    const studentId = req.params.id;
    const { status } = req.body;
    const query = `UPDATE students SET status = ? WHERE id = ?`;

    db.query(query, [status, studentId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Update failed' });
        }
        res.json({ success: true, message: 'Status updated successfully' });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});