const express = require('express');
const router = express.Router();
const loadController = require('../controllers/loadController');
const authController = require('../controllers/authController');

// Все маршруты требуют аутентификации
router.use(authController.verifyToken);

// GET /api/load - получить нагрузку всех преподавателей
router.get('/', loadController.getAll);

// GET /api/load/teacher/:teacherId - получить нагрузку преподавателя
router.get('/teacher/:teacherId', loadController.getByTeacherId);

// POST /api/load - добавить нагрузку
router.post('/', loadController.create);

// DELETE /api/load/:id - удалить нагрузку
router.delete('/:id', loadController.delete);

module.exports = router;