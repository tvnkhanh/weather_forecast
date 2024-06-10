const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        required: true,
        type: String,
        unique: true,
    },
    password: {
        required: true,
        type: String,
    },
    name: {
        required: true,
        type: String,
        trim: true,
    },
 });

const User = mongoose.model("User", userSchema);

module.exports = User;