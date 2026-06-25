const { poolPromise, sql } = require('../config/db');

class Teacher {
    // Получить всех преподавателей
    static async getAll() {
        try {
            const pool = await poolPromise;
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
            throw error;
        }
    }

    // Найти преподавателя по логину и паролю
    static async findByCredentials(login, password) {
        try {
            const pool = await poolPromise;
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
            throw error;
        }
    }

    // Получить преподавателя по ID
    static async findById(id) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
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
                    WHERE id = @id
                `);
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Teacher;