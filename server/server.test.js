// server.test.js
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

const client_id = process.env.CLIENT_TEST_ID;
const client_secret = process.env.CLIENT_TEST_SECRET;
const redirect_uri = process.env.REDIRECT_TEST_URI;

const app = express();
app.use(cookieParser());

const stateKey = 'spotify_auth_state';

function generateRandomString(length) {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

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

describe('GET /login', () => {
	it('should redirect to Spotify authorization URL', async () => {
		const response = await request(app).get('/login');
		expect(response.status).toBe(302);
		expect(response.headers.location).toMatch(/https:\/\/accounts\.spotify\.com\/authorize\?/);
	});

	it('should set a cookie with a state key', async () => {
		const response = await request(app).get('/login');
		expect(response.headers['set-cookie']).toBeDefined();
		const cookies = response.headers['set-cookie'][0];
		expect(cookies).toMatch(/spotify_auth_state=/);
	});
});
