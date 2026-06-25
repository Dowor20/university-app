const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authController = require('../controllers/authController');

// Все маршруты требуют аутентификации
router.use(authController.verifyToken);

// GET /api/teachers - получить всех преподавателей
router.get('/', teacherController.getAll);

// GET /api/teachers/:id - получить преподавателя по ID
router.get('/:id', teacherController.getById);

// POST /api/teachers - создать преподавателя
router.post('/', teacherController.create);

module.exports = router;