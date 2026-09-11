const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "artist"],
        default: "user"
    }
}, {
    timestamps: true
});

userSchema.index({ username: 1, role: 1 }, { unique: true });
userSchema.index({ email: 1, role: 1 }, { unique: true });

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;