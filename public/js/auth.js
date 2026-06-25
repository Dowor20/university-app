// DOM элементы
const loginForm = document.getElementById('loginForm');
const loginInput = document.getElementById('login');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');
const loadingMessage = document.getElementById('loadingMessage');

// Проверка, авторизован ли пользователь
if (localStorage.getItem('token') && localStorage.getItem('user')) {
    window.location.href = '/dashboard.html';
}

// Обработка отправки формы
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!login || !password) {
        showError('Пожалуйста, заполните все поля');
        return;
    }
    
    setLoading(true);
    hideError();
    
    try {
        // Используем Electron API если доступно, иначе обычный fetch
        let response;
        if (window.electronAPI && window.electronAPI.login) {
            // Desktop версия через Electron
            const result = await window.electronAPI.login(login, password);
            if (result) {
                localStorage.setItem('token', 'electron-token');
                localStorage.setItem('user', JSON.stringify(result));
                window.location.href = '/dashboard.html';
            } else {
                showError('Неверный логин или пароль');
            }
        } else {
            // Web версия через fetch
            response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, password })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/dashboard.html';
            } else {
                showError(data.message || 'Неверный логин или пароль');
            }
        }
    } catch (error) {
        console.error('Ошибка авторизации:', error);
        showError('Ошибка соединения с сервером');
    } finally {
        setLoading(false);
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function setLoading(loading) {
    if (loading) {
        loadingMessage.style.display = 'block';
        document.getElementById('loginBtn').disabled = true;
        document.getElementById('loginBtn').textContent = 'Вход...';
    } else {
        loadingMessage.style.display = 'none';
        document.getElementById('loginBtn').disabled = false;
        document.getElementById('loginBtn').textContent = 'Войти';
    }
}