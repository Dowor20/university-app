const sql = require('mssql');

// Используйте SQL Authentication (с логином и паролем)
const config = {
    server: 'DESKTOP-9J445D2',
    database: 'UniversityDepartment',
    user: 'sa',
    password: 'НОВЫЙПАРОЛЬ123',  // ЗАМЕНИТЕ НА ВАШ ПАРОЛЬ!
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

console.log('Testing connection...');
console.log('Server:', config.server);
console.log('User:', config.user);
console.log('Database:', config.database);

sql.connect(config)
    .then(pool => {
        console.log('SUCCESS! Connected to SQL Server');
        return pool.request().query('SELECT DB_NAME() as DB');
    })
    .then(result => {
        console.log('Database:', result.recordset[0].DB);
        console.log('Connection works!');
        process.exit(0);
    })
    .catch(err => {
        console.error('ERROR:', err.message);
        console.log('Try changing server to:');
        console.log('1. "localhost"');
        console.log('2. "DESKTOP-9J445D2\\SQLEXPRESS"');
        console.log('3. "."');
        process.exit(1);
    });