const { runApi } = require('../config/api.js');

const extractQueryType = (input) => {
  if (!input) return null;

  // Channel ID (starts with UC)
  if (input.startsWith('UC')) return { type: 'channelId', value: input };

  // YouTube URL
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(channel|c|user|@)([^/?]+)/;
  const match = input.match(urlRegex);
  if (match) {
    const type = match[1];
    const value = match[2];
    if (type === 'channel') return { type: 'channelId', value };
    if (type === '@') return { type: 'handle', value };
    return { type: 'name', value };
  }

  // Handle with @
  if (input.startsWith('@')) return { type: 'handle', value: input.substring(1) };

  // Fallback to search
  return { type: 'name', value: input };
};

const getChannel = async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Missing channel query' });

  const apiKey = process.env.YOUTUBE_API_KEY;

  // Search for channel
  const searchResult = await runApi({
    url: 'https://www.googleapis.com/youtube/v3/search',
    method: 'GET',
    params: {
      q: query,
      part: 'snippet',
      type: 'channel',
      maxResults: 1,
      key: apiKey,
    },
  });

  if (!searchResult.success) {
    return res.status(searchResult.status).json({ error: 'Failed to search channel', details: searchResult.error });
  }

  const items = searchResult.data.items;
  if (!items?.length) {
    return res.status(404).json({ error: 'Channel not found' });
  }

  const channelId = items[0].snippet.channelId;

  // Get channel details
  const channelResult = await runApi({
    url: 'https://www.googleapis.com/youtube/v3/channels',
    method: 'GET',
    params: {
      id: channelId,
      part: 'snippet,statistics,brandingSettings,contentDetails,topicDetails',
      key: apiKey,
    },
  });

  if (!channelResult.success) {
    return res.status(channelResult.status).json({ error: 'Failed to fetch channel', details: channelResult.error });
  }

  res.json({ data: channelResult.data.items[0] });
};

const getVideos = async (req, res) => {
  const { channelId, pageToken } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!channelId) {
    return res.status(400).json({ error: 'Missing channelId' });
  }

  const result = await runApi({
    url: 'https://www.googleapis.com/youtube/v3/search',
    method: 'GET',
    params: {
      key: apiKey,
      channelId: channelId,
      part: 'snippet,id',
      order: 'date',
      maxResults: 10,
      pageToken: pageToken,
    },
  });

  if (!result.success) {
    return res.status(result.status).json({ error: 'Failed to fetch videos', details: result.error });
  }

  res.json(result.data);
};

module.exports = {
  extractQueryType,
  getChannel,
  getVideos
};