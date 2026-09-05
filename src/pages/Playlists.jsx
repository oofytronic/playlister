import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { spotifyFetch, spotifyFetchAllPages } from '../lib/spotifyClient.js';
import Playlist from '../components/Playlist.jsx';
import PlaylistConsole from '../components/PlaylistConsole.jsx';
import SearchConsole from '../components/SearchConsole.jsx';

function getImageSrc(images) {
	if (!images || images.length === 0) return '';
	return images.length > 1 ? images[1].url : images[0].url;
}

function Playlists() {
	const { user } = useAuth();
	const [playlists, setPlaylists] = useState([]);
	const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true);
	const [listError, setListError] = useState(null);

	const [activeConsole, setActiveConsole] = useState('playlists');
	const [activePlaylist, setActivePlaylist] = useState(null);
	const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
	const [playlistError, setPlaylistError] = useState(null);

	const fetchUserPlaylists = useCallback(async () => {
		setIsLoadingPlaylists(true);
		setListError(null);
		try {
			const items = await spotifyFetchAllPages('/me/playlists?limit=50');
			setPlaylists(items);
		} catch (error) {
			console.error('Failed to fetch playlists:', error);
			setListError('Could not load your playlists. Try refreshing the page.');
		} finally {
			setIsLoadingPlaylists(false);
		}
	}, []);

	useEffect(() => {
		fetchUserPlaylists();
	}, [fetchUserPlaylists]);

	const onUpdatePlaylistName = (playlistId, newName) => {
		setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? { ...p, name: newName } : p)));
		if (activePlaylist && activePlaylist.id === playlistId) {
			setActivePlaylist((prev) => ({ ...prev, name: newName }));
		}
	};

	// The playlist objects Spotify hands back from /me/playlists and from
	// creating a playlist already carry everything we need (tracks.href,
	// owner.id, snapshot_id, images) - no separate detail fetch required.
	const openPlaylist = async (playlist) => {
		setIsLoadingPlaylist(true);
		setPlaylistError(null);
		try {
			if (!playlist?.tracks?.href) {
				throw new Error('This playlist is missing track data from Spotify.');
			}

			const tracks = await spotifyFetchAllPages(playlist.tracks.href);

			setActivePlaylist({
				id: playlist.id,
				name: playlist.name,
				tracks,
				thumbnail: getImageSrc(playlist.images),
				owner: playlist.owner.id,
				snapshotId: playlist.snapshot_id,
			});
		} catch (error) {
			console.error('Failed to load playlist:', error);
			setPlaylistError(error.message || 'Could not load this playlist.');
			setActivePlaylist(null);
		} finally {
			setIsLoadingPlaylist(false);
		}
	};

	const handleAddTrackToPlaylist = async (track) => {
		if (!activePlaylist) {
			alert('No Active Playlist. Please select a playlist before adding a song.');
			return;
		}

		const tracks = Array.isArray(activePlaylist.tracks) ? activePlaylist.tracks : [];
		if (tracks.find((t) => t.track?.id === track.id)) {
			alert('Track already exists in the playlist');
			return;
		}

		try {
			const result = await spotifyFetch(`/playlists/${activePlaylist.id}/tracks`, {
				method: 'POST',
				body: JSON.stringify({ uris: [track.uri] }),
			});

			const updatedTrack = { track: { uri: track.uri, id: track.id, name: track.name, artists: track.artists } };
			const updatedTracks = [...tracks, updatedTrack];

			setPlaylists((prev) => prev.map((p) => (p.id === activePlaylist.id ? { ...p, tracks: updatedTracks } : p)));
			setActivePlaylist((prev) => ({ ...prev, tracks: updatedTracks, snapshotId: result.snapshot_id }));
		} catch (error) {
			console.error('Failed to add track:', error);
			alert('Failed to add track. Please try again.');
		}
	};

	const handleDeleteTrack = async (playlistId, trackId) => {
		if (!window.confirm('Are you sure you want to delete this track?')) return;

		const tracks = Array.isArray(activePlaylist.tracks) ? activePlaylist.tracks : [];
		const track = tracks.find((t) => t.track?.id === trackId);
		if (!track) return;

		try {
			const result = await spotifyFetch(`/playlists/${playlistId}/tracks`, {
				method: 'DELETE',
				body: JSON.stringify({ tracks: [{ uri: track.track.uri }] }),
			});

			const updatedTracks = tracks.filter((t) => t.track?.id !== trackId);
			setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? { ...p, tracks: updatedTracks } : p)));
			if (activePlaylist && activePlaylist.id === playlistId) {
				setActivePlaylist({ ...activePlaylist, tracks: updatedTracks, snapshotId: result.snapshot_id });
			}
		} catch (error) {
			console.error('Failed to delete track:', error);
			alert('Failed to delete track. Please try again.');
		}
	};

	const handleDeletePlaylist = async (playlistId) => {
		if (!window.confirm('Are you sure you want to delete this playlist?')) return;

		try {
			await spotifyFetch(`/playlists/${playlistId}/followers`, { method: 'DELETE' });
			setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
			if (activePlaylist && activePlaylist.id === playlistId) {
				setActivePlaylist(null);
			}
		} catch (error) {
			console.error('Failed to delete playlist:', error);
			alert('Failed to delete playlist. Please try again.');
		}
	};

	const handleAddPlaylist = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const title = formData.get('playlist_title');
		const description = formData.get('playlist_description');
		const isPublic = formData.get('public');

		if (!title.trim()) {
			alert('Please enter a playlist title.');
			return;
		}

		try {
			const data = await spotifyFetch(`/users/${user.id}/playlists`, {
				method: 'POST',
				body: JSON.stringify({ name: title, description, public: isPublic === 'on' }),
			});

			setPlaylists((prev) => [data, ...prev]);
			openPlaylist(data);
		} catch (error) {
			console.error('Failed to create playlist:', error);
			alert('Failed to create playlist. Please try again.');
		}
	};

	const onTrackReorder = async (draggedTrackId, targetTrackId) => {
		if (!activePlaylist || draggedTrackId === targetTrackId) return;

		const tracks = activePlaylist.tracks;
		const rangeStart = tracks.findIndex((t) => t.track?.id === draggedTrackId);
		const targetIndex = tracks.findIndex((t) => t.track?.id === targetTrackId);
		if (rangeStart === -1 || targetIndex === -1) return;

		const insertBefore = targetIndex > rangeStart ? targetIndex + 1 : targetIndex;

		const reordered = [...tracks];
		const [moved] = reordered.splice(rangeStart, 1);
		reordered.splice(targetIndex, 0, moved);

		const previousTracks = tracks;
		setActivePlaylist((prev) => ({ ...prev, tracks: reordered }));

		try {
			const result = await spotifyFetch(`/playlists/${activePlaylist.id}/tracks`, {
				method: 'PUT',
				body: JSON.stringify({
					range_start: rangeStart,
					insert_before: insertBefore,
					range_length: 1,
					snapshot_id: activePlaylist.snapshotId,
				}),
			});
			setActivePlaylist((prev) => ({ ...prev, snapshotId: result.snapshot_id }));
		} catch (error) {
			console.error('Failed to reorder tracks, reverting:', error);
			setActivePlaylist((prev) => ({ ...prev, tracks: previousTracks }));
			alert('Failed to reorder tracks. Please try again.');
		}
	};

	return (
		<div className="flex h-full gap-4 p-4">
			<div className="flex-1 overflow-y-auto">
				{isLoadingPlaylist && <p className="text-slate-400 p-4">Loading playlist...</p>}
				{playlistError && <p className="text-red-400 p-4">{playlistError}</p>}
				{!isLoadingPlaylist && !playlistError && activePlaylist && (
					<Playlist
						key={activePlaylist.id}
						user={user}
						playlist={activePlaylist}
						onUpdatePlaylistName={onUpdatePlaylistName}
						onDeleteTrack={handleDeleteTrack}
						onDeletePlaylist={handleDeletePlaylist}
						onTrackReorder={onTrackReorder}
					/>
				)}
				{!isLoadingPlaylist && !playlistError && !activePlaylist && (
					<p className="text-slate-400 p-4">Select a playlist from the right to start editing.</p>
				)}
			</div>

			<div className="relative w-80 flex-none border-l border-white overflow-y-auto">
				<div className="bg-gradient-to-b from-70% from-slate-950/80 to-transparent sticky top-0 flex justify-between items-center gap-2 py-4 px-4">
					<p className="font-bold">Quick View</p>
					<div className="flex gap-2">
						<button className="bg-slate-900 rounded-md px-4 py-2 hover:bg-slate-800" onClick={() => setActiveConsole('playlists')}>
							Playlists
						</button>
						<button className="bg-slate-900 rounded-md px-4 py-2 hover:bg-slate-800" onClick={() => setActiveConsole('search')}>
							Search
						</button>
					</div>
				</div>
				{activeConsole === 'playlists' && (
					<PlaylistConsole
						playlists={playlists}
						isLoading={isLoadingPlaylists}
						error={listError}
						onClickPlaylist={openPlaylist}
						onAddPlaylist={handleAddPlaylist}
					/>
				)}
				{activeConsole === 'search' && <SearchConsole onAddTrack={handleAddTrackToPlaylist} />}
			</div>
		</div>
	);
}

export default Playlists;
