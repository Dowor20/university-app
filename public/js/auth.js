document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    
    try {
        // Используем Electron API
        if (window.electronAPI && window.electronAPI.login) {
            const user = await window.electronAPI.login(login, password);
            
            if (user) {
                localStorage.setItem('token', 'electron-token');
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '/dashboard.html';
            } else {
                errorDiv.textContent = 'Неверный логин или пароль';
                errorDiv.style.display = 'block';
            }
        } else {
            // Fallback: обычный fetch
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/dashboard.html';
            } else {
                errorDiv.textContent = data.message || 'Неверный логин или пароль';
                errorDiv.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Ошибка:', error);
        errorDiv.textContent = 'Ошибка соединения с сервером';
        errorDiv.style.display = 'block';
    }
});