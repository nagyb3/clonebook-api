const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    authorid: {
        type: String,
        required: true,
    },
    text: {
        type: String,
    },
    creation_date: {
        type: Date,
        default: new Date(),
    },
});

module.exports = mongoose.model("Post", postSchema);
