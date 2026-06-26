const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);

router.get('/test', (req, res) => {
    res.json({ message: 'Auth route works!' });
});

router.get('/users', async (req, res) => {
    try {
        const { poolPromise, sql } = require('../config/db');
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT login, password FROM Преподаватель');
        res.json({ users: result.recordset });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;