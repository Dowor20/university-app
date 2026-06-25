const { poolPromise, sql } = require('../config/db');

class Load {
    // Получить нагрузку всех преподавателей
    static async getAllTeachersLoad() {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query(`
                    SELECT 
                        p.фамилия + ' ' + p.имя + ' ' + p.отчество AS ФИО,
                        s.название AS Предмет,
                        s.цикл,
                        s.объем_часов AS ОбъемЧасов
                    FROM Нагрузка n
                    INNER JOIN Преподаватель p ON n.преподаватель_id = p.id
                    INNER JOIN Предмет s ON n.предмет_id = s.id
                    ORDER BY p.фамилия, s.название
                `);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Получить нагрузку конкретного преподавателя
    static async getTeacherLoad(teacherId) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('teacherId', sql.Int, teacherId)
                .query(`
                    SELECT 
                        s.название AS Предмет,
                        s.цикл,
                        s.объем_часов AS ОбъемЧасов
                    FROM Нагрузка n
                    INNER JOIN Предмет s ON n.предмет_id = s.id
                    WHERE n.преподаватель_id = @teacherId
                    ORDER BY s.название
                `);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Load;