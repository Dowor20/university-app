const { poolPromise, sql } = require('../config/db');

class Load {
    static async getAllTeachersLoad() {
        try {
            const pool = await poolPromise;
            if (!pool) return [];
            
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
            console.error('Ошибка Load.getAllTeachersLoad:', error);
            return [];
        }
    }
}

module.exports = Load;