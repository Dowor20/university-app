const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login - авторизация
router.post('/login', authController.login);  // ← убедитесь, что authController.login существует

module.exports = router;