const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    sender_username: {
        type: String,
        required: true,
    },
    receiver_username: {
        type: String,
        required: true,
    },
    creation_date: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model("Message", MessageSchema);
