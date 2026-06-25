const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload скрипт загружен');

// API для работы с Electron
contextBridge.exposeInMainWorld('electronAPI', {
    // Авторизация
    login: (login, password) => {
        console.log('Вызов login:', login);
        return ipcRenderer.invoke('login', login, password);
    },
    
    // Преподаватели
    getTeachers: () => {
        console.log('Вызов getTeachers');
        return ipcRenderer.invoke('getTeachers');
    },
    
    // Нагрузка
    getTeachersLoad: () => {
        console.log('Вызов getTeachersLoad');
        return ipcRenderer.invoke('getTeachersLoad');
    },
    
    // Системные функции
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close')
});

console.log('Electron API доступен в окне');