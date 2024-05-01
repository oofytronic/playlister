import React, { useState, useEffect } from 'react';
import './App.css';
import Nav from '../Nav.jsx';
import Playlist from '../Playlist';
import PlaylistConsole from '../PlaylistConsole';
import SearchConsole from '../SearchConsole';
import Button from '../Button';
import Track from '../Track';

// Sample data to simulate fetching from an API or database
const samplePlaylists = [
    {
        id: 'playlist1',
        name: 'Owl City Hits',
        tracks: [
            { song: 'Fireflies', artist: 'Owl City', id: 1 },
            { song: 'Montana', artist: 'Owl City', id: 2 },
            { song: 'Dinosaur Park', artist: 'Owl City', id: 3 },
            { song: 'Cave In', artist: 'Owl City', id: 4 },
            { song: 'Vanilla Twilight', artist: 'Owl City', id: 5 }
        ]
    },
    {
        id: 'playlist2',
        name: 'Port Blue Vibes',
        tracks: [
            { song: 'Fireflies', artist: 'Port Blue', id: 11 },
            { song: 'Montana', artist: 'Port Blue', id: 12 },
            { song: 'Dinosaur Park', artist: 'Port Blue', id: 13 }
        ]
    }
];

// Sample tracks for search functionality
const tempSearchModel = [
    { song: 'Cave In', artist: 'Owl City', id: 4 },
    { song: 'All My Friends', artist: 'Owl City', id: 7 },
    { song: 'Shine', artist: 'Owl City', id: 8 },
    { song: 'Wolf Bite', artist: 'Owl City', id: 9 }
];


function App() {
    const [playlists, setPlaylists] = useState(samplePlaylists);
    const [activeConsole, setActiveConsole] = useState('playlists');
    const [activePlaylist, setActivePlaylist] = useState(null);

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


    return (
        <>
            <div className="screen">
                <Nav onChangeConsole={setActiveConsole} />

                <div className="grid-area">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-5xl mt-2">Current Playlist</h1>
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

                    <div className="console">
                        {activeConsole === 'playlists' &&
                        <PlaylistConsole
                            playlists={playlists}
                            onClickPlaylist={setActivePlaylist}
                            onAddPlaylist={handleAddPlaylist} />}
                        {activeConsole === 'search' &&
                        <SearchConsole
                        	searchedTracks={tempSearchModel}
                            onAddTrack={handleAddTrackToPlaylist} />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;