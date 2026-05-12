const express = require('express');
const router = express.Router();

const {getChannel,getVideos}= require('../controllers/youtubeController.js')

router.get('/channel',getChannel);
router.get('/videos',getVideos);

module.exports = router;
