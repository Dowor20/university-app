const Load = require('../models/Load');

const loadController = {
    async getAll(req, res) {
        try {
            const load = await Load.getAllTeachersLoad();
            res.json({
                success: true,
                data: load
            });
        } catch (error) {
            console.error('Error getting load:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting load'
            });
        }
    },

    async getByTeacherId(req, res) {
        try {
            const { teacherId } = req.params;
            const load = await Load.getTeacherLoad(teacherId);
            
            res.json({
                success: true,
                data: load
            });
        } catch (error) {
            console.error('Error getting teacher load:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting teacher load'
            });
        }
    }
};

module.exports = loadController;