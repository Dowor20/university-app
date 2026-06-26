const Teacher = require('../models/Teacher');

const teacherController = {
    async getAll(req, res) {
        try {
            const teachers = await Teacher.getAll();
            res.json({
                success: true,
                data: teachers
            });
        } catch (error) {
            console.error('Error getting teachers:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting teachers'
            });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const teacher = await Teacher.findById(id);
            
            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: 'Teacher not found'
                });
            }

            res.json({
                success: true,
                data: teacher
            });
        } catch (error) {
            console.error('Error getting teacher:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting teacher'
            });
        }
    }
};

module.exports = teacherController;