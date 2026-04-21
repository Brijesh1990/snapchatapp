const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markAsSeen } = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, sendMessage);
router.get('/:conversationId', protect, getMessages);
router.put('/seen/:id', protect, markAsSeen);

module.exports = router;
