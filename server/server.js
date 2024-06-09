import express from 'express';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 8888;
const client_id = process.env.CLIENT_TEST_ID;
const client_secret = process.env.CLIENT_TEST_SECRET;
const redirect_uri = process.env.REDIRECT_TEST_URI;

if (!client_id || !client_secret || !redirect_uri) {
	console.error('Missing necessary environment variables');
	process.exit(1);
}

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

app.get('/', (req, res) => {
	res.send('Welcome to the Spotify Auth Server!');
});

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

			res.redirect(`https://bridgebeat.app#access_token=${access_token}&refresh_token=${refresh_token}`);
		} catch (error) {
			res.redirect('/#error=invalid_token');
		}
	}
});

app.post('/refresh_token', async (req, res) => {
	const { refresh_token } = req.body;
	const authOptions = {
		method: 'POST',
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		}),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64')
		}
	};

	try {
		const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
		const data = await response.json();
		res.json(data);
	} catch (error) {
		res.status(500).json({ error: 'Failed to refresh token' });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});