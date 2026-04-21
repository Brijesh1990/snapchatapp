const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    const { receiverId, text, image, video, conversationId } = req.body;

    const newMessage = new Message({
        conversationId,
        sender: req.user._id,
        receiver: receiverId,
        text,
        image,
        video
    });

    try {
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
};

// @desc    Mark message as seen and delete (Snapchat style)
// @route   PUT /api/messages/seen/:id
// @access  Private
const markAsSeen = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (message) {
            // In a real snapchat, we might delete it immediately after seen
            // For this clone, we can mark as seen and delete after a small delay or instantly
            await Message.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Message seen and deleted" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    sendMessage,
    getMessages,
    markAsSeen
};
