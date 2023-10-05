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
    numberOfLikes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Array,
    },
});

module.exports = mongoose.model("Post", postSchema);
