const express = require('express');
const router = express.Router();
const loadController = require('../controllers/loadController');

// GET /api/load - получить нагрузку всех преподавателей
router.get('/', loadController.getAll);

// GET /api/load/teacher/:teacherId - получить нагрузку преподавателя
router.get('/teacher/:teacherId', loadController.getByTeacherId);

module.exports = router;