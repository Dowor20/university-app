const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'YourPassword123',
    server: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    database: process.env.DB_NAME || 'UniversityDepartment',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Создание пула соединений
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Подключено к SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('❌ Ошибка подключения к SQL Server:', err.message);
        console.error('Проверьте настройки в файле .env');
        process.exit(1);
    });

module.exports = {
    sql,
    poolPromise
};