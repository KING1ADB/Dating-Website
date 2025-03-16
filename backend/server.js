// backend/server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username', // replace with your MySQL username
    password: 'your_password', // replace with your MySQL password
    database: 'dating_website',
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Signup endpoint
app.post('/signup', upload.single('profile_picture'), (req, res) => {
    const { name, gender, dob, country, favorite_color, height, salary, email, mobile, address, contact_method } = req.body;
    const profile_picture = req.file ? req.file.filename : null;

    const sql = 'INSERT INTO users (name, gender, dob, country, favorite_color, height, salary, email, mobile, address, contact_method, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [name, gender, dob, country, favorite_color, height, salary, email, mobile, address, contact_method, profile_picture];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});