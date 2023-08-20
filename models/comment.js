const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    comment_author_id: {
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
});

module.exports = mongoose.model("Comment", CommentSchema);
