const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Логирование ВСЕХ запросов
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url}`);
    next();
});

// === ПОДКЛЮЧЕНИЕ МАРШРУТОВ ===
console.log('🔄 Загрузка маршрутов...');

// Проверка существования файлов
const fs = require('fs');
const routesPath = path.join(__dirname, 'routes');
console.log(`📁 Папка routes: ${routesPath}`);
console.log(`📄 Файлы в папке:`, fs.readdirSync(routesPath));

// Подключение маршрутов
try {
    const authRoutes = require('./routes/auth');
    console.log('✅ authRoutes загружен');
    app.use('/api/auth', authRoutes);
    console.log('✅ /api/auth подключен');
} catch (err) {
    console.error('❌ Ошибка загрузки authRoutes:', err.message);
}

try {
    const teacherRoutes = require('./routes/teachers');
    console.log('✅ teacherRoutes загружен');
    app.use('/api/teachers', teacherRoutes);
} catch (err) {
    console.error('❌ Ошибка загрузки teacherRoutes:', err.message);
}

try {
    const loadRoutes = require('./routes/load');
    console.log('✅ loadRoutes загружен');
    app.use('/api/load', loadRoutes);
} catch (err) {
    console.error('❌ Ошибка загрузки loadRoutes:', err.message);
}

// Тестовый маршрут
app.get('/test', (req, res) => {
    res.json({ message: 'Сервер работает!' });
});

// Обработка 404
app.use((req, res) => {
    console.log(`❌ 404: ${req.method} ${req.url}`);
    res.status(404).json({ 
        success: false, 
        message: `Маршрут ${req.url} не найден` 
    });
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('❌ Ошибка:', err);
    res.status(500).json({ 
        success: false, 
        message: err.message 
    });
});

// Запуск
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
    console.log(`📚 Тест: http://localhost:${PORT}/test`);
    console.log(`📚 Тест API: http://localhost:${PORT}/api/auth/test`);
});