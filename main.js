const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Обработка ошибок
process.on('uncaughtException', (error) => {
    console.error('❌ НЕОБРАБОТАННАЯ ОШИБКА:', error);
    console.error('Стек:', error.stack);
    dialog.showErrorBox('Критическая ошибка', error.message + '\n\n' + error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ НЕОБРАБОТАННЫЙ REJECTION:', reason);
});

let mainWindow;
let server;

// =============================================
// ЗАПУСК EXPRESS СЕРВЕРА
// =============================================

function startServer() {
    try {
        const appServer = express();
        
        appServer.use(cors());
        appServer.use(express.json());
        appServer.use(express.urlencoded({ extended: true }));
        appServer.use(express.static(path.join(__dirname, 'public')));
        
        appServer.use((req, res, next) => {
            console.log(`📨 ${req.method} ${req.url}`);
            next();
        });
        
        // Проверка существования маршрутов
        try {
            const authRoutes = require('./routes/auth');
            const teacherRoutes = require('./routes/teachers');
            const loadRoutes = require('./routes/load');
            
            appServer.use('/api/auth', authRoutes);
            appServer.use('/api/teachers', teacherRoutes);
            appServer.use('/api/load', loadRoutes);
            
            console.log('✅ Маршруты загружены');
        } catch (err) {
            console.error('❌ Ошибка загрузки маршрутов:', err.message);
            console.error('Проверьте наличие файлов в папках routes/ и controllers/');
        }
        
        const PORT = 3000;
        server = appServer.listen(PORT, 'localhost', () => {
            console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
        });
        
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Порт ${PORT} занят. Попробуйте закрыть другие приложения.`);
                dialog.showErrorBox('Ошибка', `Порт ${PORT} уже используется.`);
            } else {
                console.error('❌ Ошибка сервера:', err);
            }
        });
        
        return server;
    } catch (error) {
        console.error('❌ Критическая ошибка при запуске сервера:', error);
        dialog.showErrorBox('Ошибка', 'Не удалось запустить сервер:\n' + error.message);
        return null;
    }
}

// =============================================
// IPC ОБРАБОТЧИКИ
// =============================================

ipcMain.handle('login', async (event, login, password) => {
    console.log(`🔐 Попытка входа: ${login}`);
    try {
        const Teacher = require('./models/Teacher');
        const teacher = await Teacher.findByCredentials(login, password);
        if (teacher) {
            console.log(`✅ Вход выполнен: ${teacher.ФИО}`);
            return teacher;
        } else {
            console.log(`❌ Неверный логин или пароль`);
            return null;
        }
    } catch (error) {
        console.error('❌ Ошибка авторизации:', error.message);
        return null;
    }
});

ipcMain.handle('getTeachers', async () => {
    console.log('📋 Запрос списка преподавателей');
    try {
        const Teacher = require('./models/Teacher');
        const teachers = await Teacher.getAll();
        console.log(`✅ Найдено ${teachers.length} преподавателей`);
        return teachers;
    } catch (error) {
        console.error('❌ Ошибка получения преподавателей:', error.message);
        return [];
    }
});

ipcMain.handle('getTeachersLoad', async () => {
    console.log('📊 Запрос нагрузки преподавателей');
    try {
        const Load = require('./models/Load');
        const load = await Load.getAllTeachersLoad();
        console.log(`✅ Найдено ${load.length} записей нагрузки`);
        return load;
    } catch (error) {
        console.error('❌ Ошибка получения нагрузки:', error.message);
        return [];
    }
});

// =============================================
// СОЗДАНИЕ ГЛАВНОГО ОКНА
// =============================================

function createWindow() {
    try {
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            minWidth: 800,
            minHeight: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js')
            },
            show: false
        });

        mainWindow.loadURL('http://localhost:3000');

        mainWindow.once('ready-to-show', () => {
            mainWindow.show();
        });

        mainWindow.webContents.openDevTools();

        mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            console.error('❌ Ошибка загрузки страницы:', errorDescription);
            mainWindow.loadURL(`data:text/html,
                <html>
                    <head><meta charset="UTF-8"></head>
                    <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial;flex-direction:column;background:#f0f2f5;">
                        <h1 style="color:#e53e3e;">❌ Ошибка загрузки</h1>
                        <p>${errorDescription}</p>
                        <p style="color:#666;font-size:14px;">Убедитесь, что сервер запущен на http://localhost:3000</p>
                        <button onclick="location.reload()" style="padding:10px 20px;background:#667eea;color:white;border:none;border-radius:5px;cursor:pointer;font-size:16px;">Обновить</button>
                    </body>
                </html>
            `);
        });

        mainWindow.on('closed', () => {
            mainWindow = null;
        });
    } catch (error) {
        console.error('❌ Ошибка создания окна:', error);
        dialog.showErrorBox('Ошибка', 'Не удалось создать окно:\n' + error.message);
    }
}

// =============================================
// МЕНЮ
// =============================================

function createMenu() {
    try {
        const template = [
            {
                label: 'Файл',
                submenu: [
                    { role: 'reload' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            },
            {
                label: 'Вид',
                submenu: [
                    { role: 'toggleDevTools' },
                    { type: 'separator' },
                    { role: 'toggleFullScreen' }
                ]
            }
        ];
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    } catch (error) {
        console.error('❌ Ошибка создания меню:', error);
    }
}

// =============================================
// ЗАПУСК
// =============================================

app.whenReady().then(() => {
    console.log('🚀 Запуск приложения...');
    
    // Запускаем сервер
    const serverInstance = startServer();
    if (!serverInstance) {
        dialog.showErrorBox('Ошибка', 'Не удалось запустить сервер. Приложение будет закрыто.');
        app.quit();
        return;
    }
    
    // Создаем окно
    createWindow();
    
    // Создаем меню
    createMenu();
    
    console.log('✅ Приложение запущено');
});

app.on('window-all-closed', () => {
    if (server) server.close();
    if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
    if (server) server.close();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});