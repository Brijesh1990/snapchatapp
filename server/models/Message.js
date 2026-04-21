const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String
    },
    image: {
        type: String
    },
    video: {
        type: String
    },
    isSeen: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date
    }
}, { timestamps: true });

// Message persistence logic can be handled in controllers (disappearing after seen)
module.exports = mongoose.model('Message', messageSchema);
