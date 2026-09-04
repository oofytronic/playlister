import { createPkcePair, consumeStoredCodeVerifier, generateRandomString } from './pkce.js';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/callback`;
const AUTH_STATE_KEY = 'spotify_auth_state';

const TOKEN_KEY = 'spotify_access_token';
const REFRESH_TOKEN_KEY = 'spotify_refresh_token';
const EXPIRES_AT_KEY = 'spotify_expires_at';

// Scopes cover every v1 pillar: library/playlist reads+writes, follows, and
// listening history (recently-played/top) for the ghost-follows feature.
const SCOPES = [
	'playlist-read-private',
	'playlist-read-collaborative',
	'playlist-modify-public',
	'playlist-modify-private',
	'user-follow-read',
	'user-follow-modify',
	'user-library-read',
	'user-library-modify',
	'user-read-recently-played',
	'user-top-read',
	'user-read-email',
	'user-read-private',
].join(' ');

export function getStoredTokens() {
	return {
		accessToken: localStorage.getItem(TOKEN_KEY),
		refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
		expiresAt: Number(localStorage.getItem(EXPIRES_AT_KEY)) || 0,
	};
}

function storeTokens({ access_token, refresh_token, expires_in }) {
	localStorage.setItem(TOKEN_KEY, access_token);
	if (refresh_token) {
		localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
	}
	localStorage.setItem(EXPIRES_AT_KEY, String(Date.now() + expires_in * 1000));
}

export function clearTokens() {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(REFRESH_TOKEN_KEY);
	localStorage.removeItem(EXPIRES_AT_KEY);
}

export function isLoggedIn() {
	const { accessToken, refreshToken } = getStoredTokens();
	return Boolean(accessToken || refreshToken);
}

export function isAccessTokenValid() {
	const { accessToken, expiresAt } = getStoredTokens();
	// 30s buffer so we refresh slightly before actual expiry.
	return Boolean(accessToken) && Date.now() < expiresAt - 30_000;
}

export async function login() {
	if (!CLIENT_ID) {
		throw new Error('Missing VITE_SPOTIFY_CLIENT_ID - set it in your .env file (see .env.example).');
	}

	const { codeChallenge } = await createPkcePair();
	const state = generateRandomString(16);
	sessionStorage.setItem(AUTH_STATE_KEY, state);

	const params = new URLSearchParams({
		client_id: CLIENT_ID,
		response_type: 'code',
		redirect_uri: REDIRECT_URI,
		state,
		scope: SCOPES,
		code_challenge_method: 'S256',
		code_challenge: codeChallenge,
	});

	window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export function logout() {
	clearTokens();
	window.location.href = '/';
}

// Called from the /callback route after Spotify redirects back with ?code=&state=
export async function handleAuthCallback(searchParams) {
	const code = searchParams.get('code');
	const state = searchParams.get('state');
	const error = searchParams.get('error');

	const storedState = sessionStorage.getItem(AUTH_STATE_KEY);
	sessionStorage.removeItem(AUTH_STATE_KEY);

	if (error) {
		throw new Error(`Spotify authorization failed: ${error}`);
	}
	if (!code || !state || state !== storedState) {
		throw new Error('Authorization state mismatch. Please try logging in again.');
	}

	const codeVerifier = consumeStoredCodeVerifier();
	if (!codeVerifier) {
		throw new Error('Missing PKCE code verifier. Please try logging in again.');
	}

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: CLIENT_ID,
			grant_type: 'authorization_code',
			code,
			redirect_uri: REDIRECT_URI,
			code_verifier: codeVerifier,
		}),
	});

	if (!response.ok) {
		throw new Error('Failed to exchange authorization code for a token.');
	}

	const data = await response.json();
	storeTokens(data);
	return data;
}

let refreshInFlight = null;

export async function refreshAccessToken() {
	const { refreshToken } = getStoredTokens();
	if (!refreshToken) {
		clearTokens();
		return null;
	}

	// Coalesce concurrent refresh calls (e.g. several API calls 401 at once).
	if (!refreshInFlight) {
		refreshInFlight = (async () => {
			try {
				const response = await fetch('https://accounts.spotify.com/api/token', {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: new URLSearchParams({
						client_id: CLIENT_ID,
						grant_type: 'refresh_token',
						refresh_token: refreshToken,
					}),
				});

				if (!response.ok) {
					clearTokens();
					return null;
				}

				const data = await response.json();
				storeTokens(data);
				return data.access_token;
			} finally {
				refreshInFlight = null;
			}
		})();
	}

	return refreshInFlight;
}

export async function getValidAccessToken() {
	if (isAccessTokenValid()) {
		return getStoredTokens().accessToken;
	}
	return refreshAccessToken();
}
