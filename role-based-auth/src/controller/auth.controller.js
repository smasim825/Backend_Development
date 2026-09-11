const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
    try {
        const { username, email, password, role = "user" } = req.body;

        // 🔍 Check if user already exists WITH THIS SPECIFIC ROLE
        const isUserExist = await userModel.findOne({
            $or: [
                { username: username, role: role },
                { email: email, role: role }
            ]
        });

        if (isUserExist) {
            return res.status(400).json({
                message: `An account with this ${role} role already exists for this username or email.`
            });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username,
            email,
            password: hash,
            role
        });

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
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

async function loginUser(req, res) {
    try {
        const { username, email, password, role } = req.body;

        // 1. Validate password and (username or email)
        if (!password || (!username && !email)) {
            return res.status(400).json({
                message: "Please provide password and username or email."
            });
        }

        // 2. Build search query (with optional role filter)
        const filter = {
            $or: [
                { username: username },
                { email: email }
            ]
        };

        if (role) {
            filter.role = role;
        }

        // 3. Find user in database
        const user = await userModel.findOne(filter);

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials or user role"
            });
        }

        // 4. Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials or user role"
            });
        }

        // 5. Generate token and set cookie
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Logged in successfully",
            user,
            token
        });
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
}

module.exports = { registerUser, loginUser };