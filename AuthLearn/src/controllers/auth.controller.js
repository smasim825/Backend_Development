const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        // 🔍 Check if a user with the same username OR email already exists
        const isUserExist = await userModel.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (isUserExist) {
            return res.status(400).json({
                message: "User already exists with this username or email"
            });
        }

        // 🆕 Create new user
        const user = await userModel.create({
            username,
            email,
            password
        });

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET);

        // 🍪 Set JWT Token in HTTP Cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(201).json({
            message: "User registered successfully",
            user,
            token
        });
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
}

module.exports = { registerUser };