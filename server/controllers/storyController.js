const Story = require('../models/Story');
const User = require('../models/User');

// @desc    Upload a new story
// @route   POST /api/stories
// @access  Private
const createStory = async (req, res) => {
    try {
        if (!req.file) {
            console.error('Upload Error: No file in request');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('File uploaded to Cloudinary:', req.file.path);

        const mediaUrl = req.file.path;
        const isVideo = req.file.mimetype.startsWith('video');
        
        const story = await Story.create({
            userId: req.user._id,
            mediaUrl,
            mediaType: isVideo ? 'video' : 'image'
        });

        res.status(201).json(story);
    } catch (error) {
        console.error('Story Creation Error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// @desc    Get stories from friends and self
// @route   GET /api/stories
// @access  Private
const getStories = async (req, res) => {
    const user = await User.findById(req.user._id);
    const friendIds = user.friends;
    friendIds.push(req.user._id); // Include own stories

    const stories = await Story.find({
        userId: { $in: friendIds }
    })
    .populate('userId', 'username avatar')
    .sort({ createdAt: -1 });

    // Group stories by user
    const groupedStories = stories.reduce((acc, story) => {
        const userId = story.userId._id.toString();
        if (!acc[userId]) {
            acc[userId] = {
                user: story.userId,
                stories: []
            };
        }
        acc[userId].stories.push(story);
        return acc;
    }, {});

    res.json(Object.values(groupedStories));
};

module.exports = {
    createStory,
    getStories
};
