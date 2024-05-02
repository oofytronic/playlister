const fetch = require('node-fetch'); // Ensure you've installed node-fetch if using in Node.js
const express = require('express');
const app = express();

const client_id = '899a0e6b070d4b6eae06711c13eddd13'; // Your client id
const client_secret = 'YOUR_CLIENT_SECRET'; // Your secret

app.get('/spotify_token', async (req, res) => {
    const authOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    };

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: 'Failed to retrieve access token' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


app.get('/search', async (req, res) => {
    const { token, q } = req.query; // Assume token is passed in query and user's search query as 'q'

    if (!token || !q) {
        return res.status(400).json({ error: 'Missing token or query' });
    }

    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track`;
    const searchOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(searchUrl, searchOptions);
        const data = await response.json();
        res.json(data.tracks.items); // Sending only the tracks array to the client
    } catch (error) {
        res.status(400).json({ error: 'Failed to search' });
    }
});