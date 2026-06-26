const { poolPromise, sql } = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authController = {
    async login(req, res) {
        try {
            const { login, password } = req.body;
            
            console.log('🔐 Login attempt:', login);
            
            if (!login || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Login and password required'
                });
            }

            const pool = await poolPromise;
            if (!pool) {
                return res.status(500).json({
                    success: false,
                    message: 'Database connection error'
                });
            }

            const result = await pool.request()
                .input('login', sql.NVarChar, login)
                .input('password', sql.NVarChar, password)
                .query(`
                    SELECT 
                        id,
                        фамилия,
                        имя,
                        отчество,
                        фамилия + ' ' + имя + ' ' + отчество AS ФИО,
                        категория,
                        оклад
                    FROM Преподаватель
                    WHERE логин = @login AND пароль = @password
                `);

            console.log('📊 Found records:', result.recordset.length);

            if (result.recordset.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid login or password'
                });
            }

            const teacher = result.recordset[0];

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
            console.error('❌ Auth error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error: ' + error.message
            });
        }
    }
};

module.exports = authController;