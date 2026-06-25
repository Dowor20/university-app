const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const express = require('express');
require('dotenv').config();

let mainWindow;
let server;

// =============================================
// ЗАПУСК EXPRESS СЕРВЕРА
// =============================================

function startServer() {
    return new Promise((resolve, reject) => {
        const appServer = express();
        
        // Middleware
        appServer.use(express.json());
        appServer.use(express.urlencoded({ extended: true }));
        appServer.use(express.static(path.join(__dirname, 'public')));
        
        // Подключение маршрутов
        try {
            const authRoutes = require('./routes/auth');
            const teacherRoutes = require('./routes/teachers');
            const loadRoutes = require('./routes/load');
            
            appServer.use('/api/auth', authRoutes);
            appServer.use('/api/teachers', teacherRoutes);
            appServer.use('/api/load', loadRoutes);
        } catch (err) {
            console.error('Ошибка загрузки маршрутов:', err);
        }
        
        // Запуск сервера на случайном порту
        const PORT = process.env.PORT || 3000;
        server = appServer.listen(PORT, () => {
            console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
            resolve(PORT);
        });
        
        server.on('error', reject);
    });
}

// =============================================
// СОЗДАНИЕ ГЛАВНОГО ОКНА
// =============================================

async function createWindow() {
    // Запускаем сервер
    const port = await startServer();
    
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        frame: true,
        show: false // Показываем только после загрузки
    });

    // Загружаем приложение
    mainWindow.loadURL(`http://localhost:${port}`);

    // Показываем окно после загрузки
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Открываем DevTools только в режиме разработки
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    // Обработка ошибок загрузки
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('Ошибка загрузки:', errorDescription);
        // Пробуем перезагрузить
        setTimeout(() => {
            mainWindow.loadURL(`http://localhost:${port}`);
        }, 1000);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// =============================================
// СОЗДАНИЕ МЕНЮ (упрощенное)
// =============================================

function createMenu() {
    const template = [
        {
            label: 'Файл',
            submenu: [
                {
                    label: 'Обновить',
                    accelerator: 'CmdOrCtrl+R',
                    click() {
                        if (mainWindow) mainWindow.reload();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Выход',
                    accelerator: 'CmdOrCtrl+Q',
                    click() {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Вид',
            submenu: [
                {
                    label: 'Перезагрузить',
                    accelerator: 'CmdOrCtrl+Shift+R',
                    click() {
                        if (mainWindow) mainWindow.reload();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Увеличить масштаб',
                    accelerator: 'CmdOrCtrl+=',
                    click() {
                        if (mainWindow) mainWindow.webContents.zoomIn();
                    }
                },
                {
                    label: 'Уменьшить масштаб',
                    accelerator: 'CmdOrCtrl+-',
                    click() {
                        if (mainWindow) mainWindow.webContents.zoomOut();
                    }
                },
                {
                    label: 'Сбросить масштаб',
                    accelerator: 'CmdOrCtrl+0',
                    click() {
                        if (mainWindow) mainWindow.webContents.zoomLevel = 0;
                    }
                },
                { type: 'separator' },
                {
                    label: 'Полноэкранный режим',
                    accelerator: 'F11',
                    click() {
                        if (mainWindow) mainWindow.setFullScreen(!mainWindow.isFullScreen());
                    }
                },
                {
                    label: 'DevTools',
                    accelerator: 'F12',
                    click() {
                        if (mainWindow) mainWindow.webContents.openDevTools();
                    }
                }
            ]
        },
        {
            label: 'Справка',
            submenu: [
                {
                    label: 'О программе',
                    click() {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'О программе',
                            message: 'Информационная система кафедры',
                            detail: 'Версия: 1.0.0\n© 2024 Все права защищены'
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// =============================================
// ЗАПУСК ПРИЛОЖЕНИЯ
// =============================================

app.whenReady().then(async () => {
    try {
        // Создаем окно
        await createWindow();
        
        // Создаем меню
        createMenu();
    } catch (error) {
        console.error('Ошибка запуска:', error);
        dialog.showErrorBox('Ошибка', 'Не удалось запустить приложение:\n' + error.message);
        app.quit();
    }
});

// Закрытие приложения
app.on('window-all-closed', () => {
    if (server) {
        server.close();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('before-quit', () => {
    if (server) {
        server.close();
    }
});