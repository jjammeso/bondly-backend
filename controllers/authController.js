const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'your_jwt_secret'; // Move to .env later

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const password_hash = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO Users (username, email, password_hash) VALUES ($1, $2, $3)';
  db.query(sql, [username, email, password_hash], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: 'User registered' });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM Users WHERE email = $1';

  db.query(sql, [email], async (err, result) => {
    if (err || result.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ user_id: user.user_id, username: user.username }, SECRET, { expiresIn: '7d' });
    res.json({ token });
  });
};
