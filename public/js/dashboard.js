// Проверка авторизации
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!token || !user) {
    window.location.href = '/';
}

// Отображение информации о пользователе
document.getElementById('userInfo').textContent = `👤 ${user.name}`;

// Функция для запросов
async function apiRequest(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    // Добавляем токен если есть
    const token = localStorage.getItem('token');
    if (token && token !== 'electron-token') {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    return response.json();
}

// Загрузка преподавателей
async function loadTeachers() {
    teachersList.innerHTML = '<div class="loading-spinner">Загрузка...</div>';
    
    try {
        let data;
        if (window.electronAPI && window.electronAPI.getTeachers) {
            const result = await window.electronAPI.getTeachers();
            data = { success: true, data: result };
        } else {
            data = await apiRequest('/api/teachers');
        }
        
        if (data.success) {
            renderTeachers(data.data);
        } else {
            throw new Error(data.message || 'Ошибка загрузки');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        teachersList.innerHTML = `<div class="error">❌ ${error.message}</div>`;
    }
}

// Загрузка нагрузки
async function loadTeachersLoad() {
    loadList.innerHTML = '<div class="loading-spinner">Загрузка...</div>';
    
    try {
        let data;
        if (window.electronAPI && window.electronAPI.getTeachersLoad) {
            const result = await window.electronAPI.getTeachersLoad();
            data = { success: true, data: result };
        } else {
            data = await apiRequest('/api/load');
        }
        
        if (data.success) {
            renderLoad(data.data);
        } else {
            throw new Error(data.message || 'Ошибка загрузки');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        loadList.innerHTML = `<div class="error">❌ ${error.message}</div>`;
    }
}

// ... остальные функции renderTeachers, renderLoad, обработчики вкладок и выход