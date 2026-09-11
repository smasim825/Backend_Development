async function register(req, res) {
    const { username, email, password } = req.body;

    res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        user: { username, email }
    });
}

async function login(req, res) {
    const { email } = req.body;

    res.status(200).json({
        status: 'success',
        message: 'Login successful',
        token: 'fake-jwt-token-sample',
        user: { email }
    });
}

module.exports = { register, login };
