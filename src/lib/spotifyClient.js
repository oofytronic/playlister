import { getValidAccessToken, refreshAccessToken, logout } from './spotifyAuth.js';

const API_BASE = 'https://api.spotify.com/v1';

export class SpotifyApiError extends Error {
	constructor(message, status, body) {
		super(message);
		this.name = 'SpotifyApiError';
		this.status = status;
		this.body = body;
	}
}

/**
 * Authenticated fetch against the Spotify Web API. Attaches the current
 * access token, and on a 401 refreshes once and retries before giving up.
 * `path` may be a full URL (Spotify's paginated responses hand back `next`
 * as an absolute URL) or a path relative to API_BASE.
 */
export async function spotifyFetch(path, options = {}, { _retried = false } = {}) {
	const token = await getValidAccessToken();
	if (!token) {
		logout();
		throw new SpotifyApiError('Not authenticated', 401, null);
	}

	const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

	const response = await fetch(url, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			...(options.body ? { 'Content-Type': 'application/json' } : {}),
			...options.headers,
		},
	});

	if (response.status === 401 && !_retried) {
		const refreshed = await refreshAccessToken();
		if (refreshed) {
			return spotifyFetch(path, options, { _retried: true });
		}
		logout();
		throw new SpotifyApiError('Session expired', 401, null);
	}

	if (response.status === 429) {
		const retryAfter = Number(response.headers.get('Retry-After')) || 1;
		throw new SpotifyApiError(`Rate limited, retry after ${retryAfter}s`, 429, { retryAfter });
	}

	if (!response.ok) {
		const body = await response.json().catch(() => null);
		throw new SpotifyApiError(body?.error?.message || `Spotify API error (${response.status})`, response.status, body);
	}

	if (response.status === 204) {
		return null;
	}

	return response.json();
}

/** Follows Spotify's `next` cursor to collect every item in a paginated list. */
export async function spotifyFetchAllPages(path) {
	let url = path;
	const items = [];

	while (url) {
		const page = await spotifyFetch(url);
		items.push(...(page.items || []));
		url = page.next || null;
	}

	return items;
}
