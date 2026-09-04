import { openDB } from 'idb';

// Local-only storage for playlist snapshots (the backup/version-history
// feature). Nothing here ever leaves the browser - there is no server.
const DB_NAME = 'bridgebeat';
const DB_VERSION = 1;
const SNAPSHOT_STORE = 'playlistSnapshots';

let dbPromise = null;

function getDb() {
	if (!dbPromise) {
		dbPromise = openDB(DB_NAME, DB_VERSION, {
			upgrade(db) {
				const store = db.createObjectStore(SNAPSHOT_STORE, { keyPath: 'id' });
				store.createIndex('by-playlist', 'playlistId');
				store.createIndex('by-takenAt', 'takenAt');
			},
		});
	}
	return dbPromise;
}

/**
 * @param {string} playlistId
 * @param {{ name: string, tracks: Array<{ id: string, uri: string, name: string, artists: string[], addedAt: string }> }} data
 */
export async function saveSnapshot(playlistId, data) {
	const db = await getDb();
	const takenAt = Date.now();
	const snapshot = {
		id: `${playlistId}::${takenAt}`,
		playlistId,
		takenAt,
		name: data.name,
		tracks: data.tracks,
	};
	await db.put(SNAPSHOT_STORE, snapshot);
	return snapshot;
}

export async function getSnapshotsForPlaylist(playlistId) {
	const db = await getDb();
	const snapshots = await db.getAllFromIndex(SNAPSHOT_STORE, 'by-playlist', playlistId);
	return snapshots.sort((a, b) => b.takenAt - a.takenAt);
}

export async function getLatestSnapshot(playlistId) {
	const snapshots = await getSnapshotsForPlaylist(playlistId);
	return snapshots[0] || null;
}

export async function getAllSnapshots() {
	const db = await getDb();
	const snapshots = await db.getAll(SNAPSHOT_STORE);
	return snapshots.sort((a, b) => b.takenAt - a.takenAt);
}

export async function deleteSnapshot(id) {
	const db = await getDb();
	await db.delete(SNAPSHOT_STORE, id);
}
