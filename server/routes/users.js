const express = require('express');
const router = express.Router();
const { 
    getUserProfile, 
    getUserById, 
    searchUsers, 
    sendFriendRequest, 
    handleFriendRequest,
    getPendingRequests,
    updateUserProfile
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/search', protect, searchUsers);
router.get('/requests', protect, getPendingRequests);
router.get('/:id', protect, getUserById);
router.post('/friend-request/:id', protect, sendFriendRequest);
router.put('/friend-request/:id', protect, handleFriendRequest);

module.exports = router;
