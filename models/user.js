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
    friends: {
        type: Array,
    },
    bio: {
        type: String,
        default: "Your default bio",
    },
});

module.exports = mongoose.model("User", UserSchema);
