const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

let mainWindow;
let server;

// =============================================
// ЗАПУСК EXPRESS СЕРВЕРА
// =============================================

function startServer() {
    const appServer = express();
    
    appServer.use(cors());
    appServer.use(express.json());
    appServer.use(express.urlencoded({ extended: true }));
    appServer.use(express.static(path.join(__dirname, 'public')));
    
    appServer.use((req, res, next) => {
        console.log(`📨 ${req.method} ${req.url}`);
        next();
    });
    
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
    }
    
    const PORT = 3000;
    server = appServer.listen(PORT, 'localhost', () => {
        console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
    });
    
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ Порт ${PORT} занят.`);
            dialog.showErrorBox('Ошибка', `Порт ${PORT} уже используется.`);
        } else {
            console.error('❌ Ошибка сервера:', err);
        }
    });
}

// =============================================
// IPC ОБРАБОТЧИКИ (ГЛАВНОЕ!)
// =============================================

// 1. Обработчик авторизации
ipcMain.handle('login', async (event, login, password) => {
    console.log(`🔐 Попытка входа: ${login}`);
    
    try {
        // Используем модель Teacher для проверки
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

// 2. Обработчик получения преподавателей
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

// 3. Обработчик получения нагрузки
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
        console.error('❌ Ошибка загрузки:', errorDescription);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// =============================================
    // СОЗДАНИЕ МЕНЮ
// =============================================

function createMenu() {
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
}

// =============================================
// ЗАПУСК
// =============================================

app.whenReady().then(() => {
    startServer();
    createWindow();
    createMenu();
});

app.on('window-all-closed', () => {
    if (server) server.close();
    if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
    if (server) server.close();
});