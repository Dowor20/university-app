const { poolPromise, sql } = require('../config/db');

class Teacher {
    static async getAll() {
        try {
            const pool = await poolPromise;
            if (!pool) return [];
            
            const result = await pool.request()
                .query(`
                    SELECT 
                        id,
                        фамилия,
                        имя,
                        отчество,
                        фамилия + ' ' + имя + ' ' + отчество AS ФИО,
                        категория,
                        оклад,
                        адрес,
                        логин
                    FROM Преподаватель
                    ORDER BY фамилия, имя, отчество
                `);
            return result.recordset;
        } catch (error) {
            console.error('Ошибка Teacher.getAll:', error);
            return [];
        }
    }

    static async findByCredentials(login, password) {
        try {
            const pool = await poolPromise;
            if (!pool) return null;
            
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
            return result.recordset[0];
        } catch (error) {
            console.error('Ошибка Teacher.findByCredentials:', error);
            return null;
        }
    }
}

module.exports = Teacher;