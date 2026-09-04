// Spotify Authorization Code with PKCE - no client secret required.
// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

const CODE_VERIFIER_KEY = 'spotify_code_verifier';

function generateRandomString(length) {
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const values = crypto.getRandomValues(new Uint8Array(length));
	return Array.from(values, (v) => possible[v % possible.length]).join('');
}

function base64UrlEncode(buffer) {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

async function sha256(plain) {
	const data = new TextEncoder().encode(plain);
	return crypto.subtle.digest('SHA-256', data);
}

export async function createPkcePair() {
	const codeVerifier = generateRandomString(64);
	const hashed = await sha256(codeVerifier);
	const codeChallenge = base64UrlEncode(hashed);

	sessionStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);

	return { codeVerifier, codeChallenge };
}

export function consumeStoredCodeVerifier() {
	const verifier = sessionStorage.getItem(CODE_VERIFIER_KEY);
	sessionStorage.removeItem(CODE_VERIFIER_KEY);
	return verifier;
}

export { generateRandomString };
