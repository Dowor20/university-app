const { contextBridge, ipcRenderer } = require('electron');

console.log('✅ Preload скрипт загружен');

// Экспортируем API для окна
contextBridge.exposeInMainWorld('electronAPI', {
    // Авторизация
    login: (login, password) => {
        console.log(`📤 Вызов login: ${login}`);
        return ipcRenderer.invoke('login', login, password);
    },
    
    // Преподаватели
    getTeachers: () => {
        console.log('📤 Вызов getTeachers');
        return ipcRenderer.invoke('getTeachers');
    },
    
    // Нагрузка
    getTeachersLoad: () => {
        console.log('📤 Вызов getTeachersLoad');
        return ipcRenderer.invoke('getTeachersLoad');
    }
});

console.log('✅ Electron API доступен в окне');