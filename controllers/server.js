const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url}`);
    next();
});

app.get('/test', (req, res) => {
    res.json({ success: true, message: 'Server works!' });
});

app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'API works!' });
});

console.log('Loading routes...');

try {
    const authRoutes = require('./routes/auth');
    app.use('/api/auth', authRoutes);
    console.log('✅ /api/auth loaded');
} catch (err) {
    console.error('❌ Error authRoutes:', err.message);
}

try {
    const teacherRoutes = require('./routes/teachers');
    app.use('/api/teachers', teacherRoutes);
    console.log('✅ /api/teachers loaded');
} catch (err) {
    console.error('❌ Error teacherRoutes:', err.message);
}

try {
    const loadRoutes = require('./routes/load');
    app.use('/api/load', loadRoutes);
    console.log('✅ /api/load loaded');
} catch (err) {
    console.error('❌ Error loadRoutes:', err.message);
}

app.use((req, res) => {
    console.log(`❌ 404: ${req.method} ${req.url}`);
    res.status(404).json({ success: false, message: `Route ${req.url} not found` });
});

app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({ success: false, message: err.message });
});

app.listen(PORT, () => {
    console.log(`✅ Server started on http://localhost:${PORT}`);
    console.log(`📚 Test: http://localhost:${PORT}/test`);
});