const Load = require('../models/Load');

const loadController = {
    // Получить нагрузку всех преподавателей
    async getAll(req, res) {
        try {
            const load = await Load.getAllTeachersLoad();
            res.json({
                success: true,
                data: load
            });
        } catch (error) {
            console.error('Ошибка получения нагрузки:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении данных'
            });
        }
    },

    // Получить нагрузку конкретного преподавателя
    async getByTeacherId(req, res) {
        try {
            const { teacherId } = req.params;
            const load = await Load.getTeacherLoad(teacherId);
            
            res.json({
                success: true,
                data: load
            });
        } catch (error) {
            console.error('Ошибка получения нагрузки преподавателя:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении данных'
            });
        }
    },

    // Добавить нагрузку
    async create(req, res) {
        try {
            const { преподаватель_id, предмет_id } = req.body;
            const id = await Load.create(преподаватель_id, предмет_id);
            
            res.status(201).json({
                success: true,
                message: 'Нагрузка добавлена',
                id: id
            });
        } catch (error) {
            console.error('Ошибка добавления нагрузки:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при добавлении нагрузки'
            });
        }
    },

    // Удалить нагрузку
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Load.delete(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Нагрузка не найдена'
                });
            }

            res.json({
                success: true,
                message: 'Нагрузка удалена'
            });
        } catch (error) {
            console.error('Ошибка удаления нагрузки:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при удалении нагрузки'
            });
        }
    }
};

module.exports = loadController;