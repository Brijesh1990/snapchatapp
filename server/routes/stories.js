const express = require('express');
const router = express.Router();
const { createStory, getStories } = require('../controllers/storyController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../utils/cloudinary');

router.post('/', protect, upload.single('media'), createStory);
router.get('/', protect, getStories);

module.exports = router;
