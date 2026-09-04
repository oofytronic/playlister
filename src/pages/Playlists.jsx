import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { spotifyFetch } from '../lib/spotifyClient.js';
import Playlist from '../components/Playlist.jsx';
import PlaylistConsole from '../components/PlaylistConsole.jsx';
import SearchConsole from '../components/SearchConsole.jsx';

function Playlists() {
	const { user } = useAuth();
	const [playlists, setPlaylists] = useState([]);
	const [activeConsole, setActiveConsole] = useState('playlists');
	const [activePlaylist, setActivePlaylist] = useState(null);

	const fetchUserPlaylists = async () => {
		try {
			const data = await spotifyFetch('/me/playlists');
			return data.items;
		} catch (error) {
			console.error('Failed to fetch playlists:', error);
			return [];
		}
	};

	useEffect(() => {
		fetchUserPlaylists().then(setPlaylists);
	}, []);

	const onUpdatePlaylistName = (playlistId, newName) => {
		setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? { ...p, name: newName } : p)));
		if (activePlaylist && activePlaylist.id === playlistId) {
			setActivePlaylist((prev) => ({ ...prev, name: newName }));
		}
	};

	const handleAddTrackToPlaylist = async (track) => {
		if (!activePlaylist) {
			alert('No Active Playlist. Please select a playlist before adding a song.');
			return;
		}

		const tracks = Array.isArray(activePlaylist.tracks) ? activePlaylist.tracks : [];
		if (tracks.find((t) => t.track.id === track.id)) {
			alert('Track already exists in the playlist');
			return;
		}

		try {
			await spotifyFetch(`/playlists/${activePlaylist.id}/tracks`, {
				method: 'POST',
				body: JSON.stringify({ uris: [track.uri] }),
			});

			const updatedTrack = { track: { uri: track.uri, id: track.id, name: track.name, artists: track.artists } };

			setPlaylists((prev) =>
				prev.map((p) => (p.id === activePlaylist.id ? { ...p, tracks: [...(Array.isArray(p.tracks) ? p.tracks : []), updatedTrack] } : p))
			);
			setActivePlaylist((prev) => ({ ...prev, tracks: [...tracks, updatedTrack] }));
		} catch (error) {
			console.error('Failed to add track:', error);
		}
	};

	const handleDeleteTrack = async (playlistId, trackId) => {
		if (!window.confirm('Are you sure you want to delete this track?')) return;

		const tracks = Array.isArray(activePlaylist.tracks) ? activePlaylist.tracks : [];
		const track = tracks.find((t) => t.track.id === trackId);
		if (!track) return;

		try {
			await spotifyFetch(`/playlists/${playlistId}/tracks`, {
				method: 'DELETE',
				body: JSON.stringify({ tracks: [{ uri: track.track.uri }] }),
			});

			const updatedTracks = tracks.filter((t) => t.track.id !== trackId);
			setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? { ...p, tracks: updatedTracks } : p)));
			if (activePlaylist && activePlaylist.id === playlistId) {
				setActivePlaylist({ ...activePlaylist, tracks: updatedTracks });
			}
		} catch (error) {
			console.error('Failed to delete track:', error);
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
			setActivePlaylist(data);
		} catch (error) {
			console.error('Failed to create playlist:', error);
		}
	};

	const getImageSrc = (images) => {
		if (!images || images.length === 0) return '';
		return images.length > 1 ? images[1].url : images[0].url;
	};

	const fetchPlaylistTracks = async (playlist) => {
		try {
			const data = await spotifyFetch(playlist.tracks.href);
			setActivePlaylist({
				id: playlist.id,
				name: playlist.name,
				tracks: data.items,
				thumbnail: getImageSrc(playlist.images),
				owner: playlist.owner.id,
			});
		} catch (error) {
			console.error('Failed to fetch playlist tracks:', error);
		}
	};

	const onTrackReorder = (draggedTrackId, targetTrackId) => {
		if (!activePlaylist) return;
		const tracks = [...activePlaylist.tracks];
		const draggedIndex = tracks.findIndex((t) => t.track.id === draggedTrackId);
		const targetIndex = tracks.findIndex((t) => t.track.id === targetTrackId);
		if (draggedIndex === -1 || targetIndex === -1) return;

		const [removed] = tracks.splice(draggedIndex, 1);
		tracks.splice(targetIndex, 0, removed);

		setActivePlaylist({ ...activePlaylist, tracks });
		setPlaylists((prev) => prev.map((p) => (p.id === activePlaylist.id ? { ...p, tracks } : p)));
	};

	return (
		<div className="flex h-full gap-4 p-4">
			<div className="flex-1 overflow-y-auto">
				{activePlaylist ? (
					<Playlist
						user={user}
						playlist={activePlaylist}
						onUpdatePlaylistName={onUpdatePlaylistName}
						onDeleteTrack={handleDeleteTrack}
						onDeletePlaylist={handleDeletePlaylist}
						onTrackReorder={onTrackReorder}
					/>
				) : (
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
					<PlaylistConsole playlists={playlists} onClickPlaylist={fetchPlaylistTracks} onAddPlaylist={handleAddPlaylist} />
				)}
				{activeConsole === 'search' && <SearchConsole onAddTrack={handleAddTrackToPlaylist} />}
			</div>
		</div>
	);
}

export default Playlists;
