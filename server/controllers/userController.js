const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).populate('friends', 'username avatar bio');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get other user profile
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Search users
// @route   GET /api/users/search?q=...
// @access  Private
const searchUsers = async (req, res) => {
    const query = req.query.q;
    const users = await User.find({
        username: { $regex: query, $options: 'i' },
        _id: { $ne: req.user._id }
    }).select('username avatar bio');
    res.json(users);
};

// @desc    Send friend request
// @route   POST /api/users/friend-request/:id
// @access  Private
const sendFriendRequest = async (req, res) => {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (receiverId === senderId.toString()) {
        return res.status(400).json({ message: 'You cannot add yourself' });
    }

    const existingRequest = await FriendRequest.findOne({
        sender: senderId,
        receiver: receiverId,
        status: 'pending'
    });

    if (existingRequest) {
        return res.status(400).json({ message: 'Friend request already sent' });
    }

    const request = await FriendRequest.create({
        sender: senderId,
        receiver: receiverId
    });

    res.status(201).json(request);
};

// @desc    Handle friend request (accept/reject)
// @route   PUT /api/users/friend-request/:id
// @access  Private
const handleFriendRequest = async (req, res) => {
    const { status } = req.body; // 'accepted' or 'rejected'
    const request = await FriendRequest.findById(req.params.id);

    if (!request) {
        return res.status(404).json({ message: 'Request not found' });
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    request.status = status;
    await request.save();

    if (status === 'accepted') {
        await User.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.receiver } });
        await User.findByIdAndUpdate(request.receiver, { $addToSet: { friends: request.sender } });
    }

    res.json(request);
};

const getPendingRequests = async (req, res) => {
    const requests = await FriendRequest.find({
        receiver: req.user._id,
        status: 'pending'
    }).populate('sender', 'username avatar');
    res.json(requests);
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const { bio, avatar } = req.body;
        const updateFields = {};
        if (bio !== undefined) updateFields.bio = bio;
        if (avatar !== undefined) updateFields.avatar = avatar;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Update failed', error: error.message });
    }
};

module.exports = {
    getUserProfile,
    getUserById,
    searchUsers,
    sendFriendRequest,
    handleFriendRequest,
    getPendingRequests,
    updateUserProfile
};
