const express = require('express');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running smoothly' });
});

module.exports = app;
