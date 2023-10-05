const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    comment_author_username: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    post_id: {
        type: String,
        required: true,
    },
    numberOfLikes: {
        type: Number,
        default: 0,
    },
    creation_date: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model("Comment", CommentSchema);
