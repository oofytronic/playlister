import React, { useState, useEffect } from 'react';
import './App.css';
import Nav from '../Nav.jsx';
import Playlist from '../Playlist';
import PlaylistConsole from '../PlaylistConsole';
import SearchConsole from '../SearchConsole';
import Button from '../Button';
import Track from '../Track';

function App() {
    const [playlists, setPlaylists] = useState([]);
    const [activeConsole, setActiveConsole] = useState('playlists');
    const [activePlaylist, setActivePlaylist] = useState(null);

    const fetchUserPlaylists = async () => {
	    const token = window.localStorage.getItem('spotify_access_token'); // Get the stored token
	    if (!token) {
	        console.log('No token available');
	        return [];
	    }

	    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
	        headers: {
	            'Authorization': `Bearer ${token}`
	        }
	    });

	    if (!response.ok) {
	        throw new Error(`HTTP error! Status: ${response.status}`);
	    }

	    const data = await response.json();
	    console.log(data.items)
	    return data.items; // This contains the array of playlists
	};

    const onUpdatePlaylistName = (playlistId, newName) => {
	    const updatedPlaylists = playlists.map(playlist => {
	        if (playlist.id === playlistId) {
	            return { ...playlist, name: newName };
	        }
	        return playlist;
	    });
	    setPlaylists(updatedPlaylists);

	    // Update activePlaylist if it's the one being edited
	    if (activePlaylist && activePlaylist.id === playlistId) {
	        setActivePlaylist(prev => ({ ...prev, name: newName }));
	    }
	};

    const handleDeleteTrack = (playlistId, trackId) => {
	    const updatedPlaylists = playlists.map(playlist => {
	        if (playlist.id === playlistId) {
	            return {
	                ...playlist,
	                tracks: playlist.tracks.filter(track => track.id !== trackId)
	            };
	        }
	        return playlist;
	    });
	    setPlaylists(updatedPlaylists);

	    // Update activePlaylist to trigger re-render
	    if (activePlaylist && activePlaylist.id === playlistId) {
	        setActivePlaylist({
	            ...activePlaylist,
	            tracks: activePlaylist.tracks.filter(track => track.id !== trackId)
	        });
	    }
	};

    const handleAddTrackToPlaylist = (track) => {
	    if (!activePlaylist) return; // No active playlist selected

	    const updatedPlaylists = playlists.map(playlist => {
	        if (playlist.id === activePlaylist.id) {
	            // Prevent adding duplicate tracks
	            if (!playlist.tracks.find(t => t.id === track.id)) {
	                return { ...playlist, tracks: [...playlist.tracks, track] };
	            }
	        }
	        return playlist;
	    });

	    setPlaylists(updatedPlaylists);

	    // Update activePlaylist to trigger re-render
	    if (!activePlaylist.tracks.find(t => t.id === track.id)) {
	        setActivePlaylist({
	            ...activePlaylist,
	            tracks: [...activePlaylist.tracks, track]
	        });
	    }
	};

	const handleDeletePlaylist = (playlistId) => {
	    const updatedPlaylists = playlists.filter(playlist => playlist.id !== playlistId);
	    setPlaylists(updatedPlaylists);

	    // If the active playlist is the one being deleted, reset the activePlaylist
	    if (activePlaylist && activePlaylist.id === playlistId) {
	        setActivePlaylist(null);
	    }
	};

	const handleAddPlaylist = (newPlaylist) => {
	    setPlaylists([...playlists, newPlaylist]);
	};

	const fetchPlaylistTracks = async (playlist) => {
		const tracksUrl = playlist.tracks.href;
	    const token = window.localStorage.getItem('spotify_access_token'); // Ensure you have the token
	    if (!token) {
	        console.error('No access token available');
	        return;
	    }

	    const response = await fetch(tracksUrl, {
	        headers: {
	            'Authorization': `Bearer ${token}`
	        }
	    });

	    if (!response.ok) {
	        throw new Error(`HTTP error! Status: ${response.status}`);
	    }

	    const data = await response.json();

	    const playlistObj = {
	    	id: playlist.id,
	    	name: playlist.name,
	    	tracks: data.items,
	    	thumbnail: playlist.images[1].url
	    }

	    setActivePlaylist(playlistObj);
	};

	const onTrackReorder = (draggedTrackId, targetTrackId) => {
	    const updatedPlaylists = playlists.map(playlist => {
	        if (playlist === activePlaylist) {
	            const draggedTrackIndex = playlist.tracks.findIndex(t => t.id === draggedTrackId);
	            const targetTrackIndex = playlist.tracks.findIndex(t => t.id === targetTrackId);
	            const [removed] = playlist.tracks.splice(draggedTrackIndex, 1);
	            playlist.tracks.splice(targetTrackIndex, 0, removed);
	        }
	        return playlist;
	    });
	    setPlaylists(updatedPlaylists);
	    setActivePlaylist({ ...activePlaylist, tracks: updatedPlaylists.find(p => p === activePlaylist).tracks });
	};

	useEffect(() => {
        fetchUserPlaylists()
            .then(items => setPlaylists(items))
            .catch(error => console.error('Failed to fetch playlists:', error));
    }, []);

    return (
        <>
            <div className="grid-area">
            	<Nav />

                <div className="flex flex-col gap-4 overflow-y-scroll border-white border-2 rounded-md p-4">
                    <h1 className="text-4xl mt-2">Current Playlist</h1>
                    <div className="componentArea">
                        {activePlaylist &&
                        <Playlist
                            playlist={activePlaylist}
                            playlists={playlists}
                            onUpdatePlaylistName={onUpdatePlaylistName}
                            onDeleteTrack={handleDeleteTrack}
                            onDeletePlaylist={handleDeletePlaylist}
                            onTrackReorder={onTrackReorder} />}
                    </div>
                </div>

                <div className="relative console overflow-y-scroll border-white border-2 rounded-md px-4 pb-4">
                	<div className="bg-slate-950 sticky top-0 flex justify-end gap-2 list-none py-4">
                    	<li><button onClick={() => setActiveConsole('playlists')}>Playlists</button></li>
						<li><button onClick={() => setActiveConsole('search')}>Search</button></li>
					</div>
                    {activeConsole === 'playlists' &&
                    <PlaylistConsole
                        playlists={playlists}
                        onClickPlaylist={fetchPlaylistTracks}
                        onAddPlaylist={handleAddPlaylist} />}
                    {activeConsole === 'search' &&
                    <SearchConsole
                        onAddTrack={handleAddTrackToPlaylist} />}
                </div>
            </div>
        </>
    );
}

export default App;