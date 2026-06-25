const Teacher = require('../models/Teacher');

const teacherController = {
    // Получить всех преподавателей
    async getAll(req, res) {
        try {
            const teachers = await Teacher.getAll();
            res.json({
                success: true,
                data: teachers
            });
        } catch (error) {
            console.error('Ошибка получения преподавателей:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении данных'
            });
        }
    },

    // Получить преподавателя по ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const teacher = await Teacher.findById(id);
            
            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: 'Преподаватель не найден'
                });
            }

            res.json({
                success: true,
                data: teacher
            });
        } catch (error) {
            console.error('Ошибка получения преподавателя:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении данных'
            });
        }
    },

    // Создать преподавателя
    async create(req, res) {
        try {
            const teacherData = req.body;
            const id = await Teacher.create(teacherData);
            
            res.status(201).json({
                success: true,
                message: 'Преподаватель создан',
                id: id
            });
        } catch (error) {
            console.error('Ошибка создания преподавателя:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при создании преподавателя'
            });
        }
    }
};

module.exports = teacherController;