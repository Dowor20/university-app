const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// GET /api/teachers - получить всех преподавателей
router.get('/', teacherController.getAll);

// GET /api/teachers/:id - получить преподавателя по ID
router.get('/:id', teacherController.getById);

module.exports = router;