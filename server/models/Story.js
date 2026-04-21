const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mediaUrl: {
        type: String,
        required: true
    },
    mediaType: {
        type: String,
        enum: ['image', 'video'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '24h' } // Auto-delete after 24 hours
    }
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);
