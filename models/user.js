const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    numberOfLikes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Array,
    },
});

module.exports = mongoose.model("User", UserSchema);
