const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    database: process.env.DB_NAME || 'UniversityDepartment',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

console.log('🔌 Connecting to SQL Server...');
console.log(`📡 Server: ${config.server}`);
console.log(`👤 User: ${config.user}`);
console.log(`📚 Database: ${config.database}`);

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('❌ Connection error:', err.message);
        return null;
    });

module.exports = {
    sql,
    poolPromise
};