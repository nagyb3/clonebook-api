const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    author_username: {
        type: String,
        required: true,
    },
    text: {
        type: String,
    },
    creation_date: {
        type: Date,
        required: true,
    },
    users_who_liked: {
        type: Array,
        default: [],
    },
    comments: {
        type: Array,
    },
});

module.exports = mongoose.model("Post", postSchema);
