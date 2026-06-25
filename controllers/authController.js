const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authController = {
    // Авторизация пользователя
    async login(req, res) {
        try {
            const { login, password } = req.body;
            
            if (!login || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Логин и пароль обязательны'
                });
            }

            const teacher = await Teacher.findByCredentials(login, password);
            
            if (!teacher) {
                return res.status(401).json({
                    success: false,
                    message: 'Неверный логин или пароль'
                });
            }

            // Создание JWT токена
            const token = jwt.sign(
                { 
                    id: teacher.id,
                    name: teacher.ФИО,
                    category: teacher.категория 
                },
                process.env.JWT_SECRET || 'secret_key',
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                user: {
                    id: teacher.id,
                    name: teacher.ФИО,
                    category: teacher.категория,
                    salary: teacher.оклад
                }
            });

        } catch (error) {
            console.error('Ошибка авторизации:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера'
            });
        }
    },

    // Проверка токена
    verifyToken(req, res, next) {
        const token = req.headers['authorization']?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Токен не предоставлен'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(403).json({
                success: false,
                message: 'Недействительный токен'
            });
        }
    }
};

module.exports = authController;