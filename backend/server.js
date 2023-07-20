const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;
const path = require('path');

// Spotify API credentials
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const authEndpoint = 'https://accounts.spotify.com/api/token';

let accessToken = '';

// Make API request to get access token
const getAccessToken = async () => {
  try {
    const response = await axios.post(authEndpoint, 'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
    });
    accessToken = response.data.access_token;
    console.log('Access token:', accessToken);
  } catch (error) {
    console.error('Error getting access token:', error);
  }
};

// Middleware to refresh access token every hour
app.use((req, res, next) => {
  if (!accessToken) {
    getAccessToken();
  }
  setTimeout(getAccessToken, 1000 * 60 * 60); // Refresh every hour
  next();
});

// Endpoint to search data from the Spotify API
app.get('/api/spotify/search/:id', async (req, res) => {
  const { id } = req.params;
  const url = `https://api.spotify.com/v1/tracks/${id}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = response.data;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error in Spotify API request' });
  }
});

// Endpoint to search data from the Spotify Lyrics API
app.get('/api/lyrics/search/:link', async (req, res) => {
  const { link } = req.params;
  const apiUrl = `https://spotify-lyric-api.herokuapp.com/?url=${encodeURIComponent(link)}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error in Spotify Lyrics API request' });
  }
});

// Endpoint to search data from the Musixmatch API
app.get('/api/musixmatch/search/:isrc', async (req, res) => {
  const { isrc } = req.params;
  const musixmatchApiKey = process.env.MUSIXMATCH_API_KEY;
  const apiUrl = `https://api.musixmatch.com/ws/1.1/track.get?apikey=${musixmatchApiKey}&track_isrc=/${isrc}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error in Musixmatch API request' });
  }
});

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
