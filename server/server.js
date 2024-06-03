import express from 'express';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import 'dotenv/config';


// const client_id = 'e65e3c5df0184e0f9d104b88da16b5fd';
// const redirect_uri = encodeURIComponent('https://bridgebeat.app');
const client_id = 'e65e3c5df0184e0f9d104b88da16b5fd';
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://localhost:8888/callback';

const app = express();
app.use(cookieParser());

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const stateKey = 'spotify_auth_state';

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = 'ugc-image-upload playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-library-modify user-library-read user-read-email user-read-private';
  const queryParams = new URLSearchParams({
    response_type: 'code',
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams.toString()}`);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#error=state_mismatch');
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      method: 'POST',
      body: new URLSearchParams({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64')
      }
    };

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
      const data = await response.json();
      const access_token = data.access_token;
      const refresh_token = data.refresh_token;

      res.redirect('/#' +
        new URLSearchParams({
          access_token: access_token,
          refresh_token: refresh_token
        }).toString());
    } catch (error) {
      res.redirect('/#error=invalid_token');
    }
  }
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
