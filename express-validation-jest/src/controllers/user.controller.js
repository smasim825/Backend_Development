async function getProfile(req, res) {
    res.status(200).json({
        status: 'success',
        user: {
            id: '123',
            username: 'testuser',
            email: 'test@example.com',
            role: 'user'
        }
    });
}

async function updateProfile(req, res) {
    const { age, role } = req.body;

    res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        updatedFields: { age, role }
    });
}

module.exports = { getProfile, updateProfile };
