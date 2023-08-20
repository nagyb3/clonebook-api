const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    sender_user_id: {
        type: String,
        required: true,
    },
    receiver_user_id: {
        type: String,
        required: true,
    },
    creation_date: {
        type: Date,
        default: new Date(),
    },
});

module.exports = mongoose.model("Message", MessageSchema);
