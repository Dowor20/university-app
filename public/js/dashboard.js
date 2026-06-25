// Проверка авторизации
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!token || !user) {
    window.location.href = '/';
}

document.getElementById('userInfo').textContent = `👤 ${user.ФИО || user.name}`;

// Загрузка преподавателей
async function loadTeachers() {
    const teachersList = document.getElementById('teachersList');
    teachersList.innerHTML = '<div class="loading-spinner">Загрузка...</div>';
    
    try {
        let teachers;
        
        if (window.electronAPI && window.electronAPI.getTeachers) {
            teachers = await window.electronAPI.getTeachers();
        } else {
            const response = await fetch('/api/teachers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            teachers = data.data || [];
        }
        
        renderTeachers(teachers);
    } catch (error) {
        console.error('Ошибка:', error);
        teachersList.innerHTML = `<div class="error">❌ Ошибка загрузки: ${error.message}</div>`;
    }
}

// Загрузка нагрузки
async function loadTeachersLoad() {
    const loadList = document.getElementById('loadList');
    loadList.innerHTML = '<div class="loading-spinner">Загрузка...</div>';
    
    try {
        let loadData;
        
        if (window.electronAPI && window.electronAPI.getTeachersLoad) {
            loadData = await window.electronAPI.getTeachersLoad();
        } else {
            const response = await fetch('/api/load', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            loadData = data.data || [];
        }
        
        renderLoad(loadData);
    } catch (error) {
        console.error('Ошибка:', error);
        loadList.innerHTML = `<div class="error">❌ Ошибка загрузки: ${error.message}</div>`;
    }
}

// Отображение преподавателей
function renderTeachers(teachers) {
    const teachersList = document.getElementById('teachersList');
    
    if (!teachers || teachers.length === 0) {
        teachersList.innerHTML = '<div class="loading-spinner">Нет данных</div>';
        return;
    }
    
    let html = `<table><thead><tr>
        <th>ФИО</th><th>Категория</th><th>Оклад</th>
    </tr></thead><tbody>`;
    
    teachers.forEach(teacher => {
        const fio = teacher.ФИО || `${teacher.фамилия} ${teacher.имя} ${teacher.отчество}`;
        html += `<tr>
            <td><strong>${fio}</strong></td>
            <td>${teacher.категория}</td>
            <td>${teacher.оклад} руб.</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    teachersList.innerHTML = html;
}

// Отображение нагрузки
function renderLoad(loadData) {
    const loadList = document.getElementById('loadList');
    
    if (!loadData || loadData.length === 0) {
        loadList.innerHTML = '<div class="loading-spinner">Нет данных</div>';
        return;
    }
    
    let html = `<table><thead><tr>
        <th>ФИО преподавателя</th><th>Предмет</th><th>Цикл</th><th>Объем часов</th>
    </tr></thead><tbody>`;
    
    loadData.forEach(item => {
        html += `<tr>
            <td><strong>${item.ФИО}</strong></td>
            <td>${item.Предмет}</td>
            <td>${item.цикл}</td>
            <td>${item.ОбъемЧасов}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    loadList.innerHTML = html;
}

// Обработка вкладок
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + 'Tab').classList.add('active');
        
        if (tab.dataset.tab === 'teachers') loadTeachers();
        else if (tab.dataset.tab === 'load') loadTeachersLoad();
    });
});

// Выход
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
});

// Загрузка данных
document.addEventListener('DOMContentLoaded', () => {
    loadTeachers();
    loadTeachersLoad();
});