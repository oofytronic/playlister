import { useState, useEffect } from 'react';
import './App.css';

import Nav from '../Nav.jsx';
import Track from '../Track.jsx';
import Button from '../Button.jsx';
import Playlist from '../Playlist.jsx';

import PlaylistConsole from '../PlaylistConsole.jsx';
import SearchConsole from '../SearchConsole.jsx';

const tempSearchModel = [
	{
		song: 'Cave In',
		artist: 'Owl City',
		id: 4
	},
	{
		song: 'All My Friends',
		artist: 'Owl City',
		id: 7
	},
	{
		song: 'Shine',
		artist: 'Owl City',
		id: 8
	},
	{
		song: 'Wolf Bite',
		artist: 'Owl City',
		id: 9
	}
];

async function fetchPlaylists() {
	return [
		{
			id: 'playlist1',
			name: 'Owl City Hits',
			tracks: [
				{
					song: 'Fireflies',
					artist: 'Owl City',
					id: 1
				},
				{
					song: 'Montana',
					artist: 'Owl City',
					id: 2
				},
				{
					song: 'Dinosaur Park',
					artist: 'Owl City',
					id: 3
				},
				{
					song: 'Cave In',
					artist: 'Owl City',
					id: 4
				},
				{
					song: 'Vanilla Twilight',
					artist: 'Owl City',
					id: 5
				}
			]
	    },
	    {
			id: 'playlist2',
			name: 'Port Blue Vibes',
			tracks: [
				{
					song: 'Fireflies',
					artist: 'Port Blue',
					id: 11
				},
				{
					song: 'Montana',
					artist: 'Port Blue',
					id: 12
				},
				{
					song: 'Dinosaur Park',
					artist: 'Port Blue',
					id: 13
				}
			]
	    }
	]
}

const App = () => {
	const [playlists, setPlaylists] = useState([]);
	const [searchedTracks, setSearchedTracks] = useState(tempSearchModel);
	const [activeConsole, setActiveConsole] = useState('playlists');
	const [activePlaylist, setActivePlaylist] = useState();

	useEffect(() => {
		fetchPlaylists().then(data => setPlaylists(data));
	}, []);

	const handleTrackAdd = (trackToAdd) => {
	    // setPlaylistTracks(prevTracks => [...prevTracks, trackToAdd]);
		setPlaylists(prev => prev.map(playlist => {
		  if (playlist.id === activePlaylist.id) {
		  	if (playlist.tracks.find(track => track.id === trackToAdd.id)) {
		      alert('Track is already in the playlist');
		      return;
		    }

		    return {
		      ...playlist,
		      tracks: [...playlist.tracks, trackToAdd]
		    };
		  }
		  return playlist;
		}));
	};

	function handleTrackDelete(trackId) {
		setPlaylistTracks(currentTracks => currentTracks.filter(track => track.id !== trackId));
	}

	const addPlaylist = (newPlaylist) => {
	    setPlaylists(prev => [...prev, newPlaylist]);
	};

	const deletePlaylist = (playlistId) => {
	setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
	};

	const updatePlaylist = (updatedPlaylist) => {
	setPlaylists(prev => prev.map(playlist => playlist.id === updatedPlaylist.id ? updatedPlaylist : playlist));
	};

	const addTrackToPlaylist = (playlists, playlistId, newTrack) => {
	setPlaylists(prev => prev.map(playlist => {
	  if (playlist.id === playlistId) {
	    return {
	      ...playlist,
	      tracks: [...playlist.tracks, newTrack]
	    };
	  }
	  return playlist;
	}));
	};

	const handleDeleteTrack = (playlistId, trackId) => {
		setPlaylists(prev => prev.map(playlist => {
		  if (playlist.id === playlistId) {
		    return {
		      ...playlist,
		      tracks: playlist.tracks.filter(track => track.id !== trackId)
		    };
		  }
		  return playlist;
		}));
	};

	return (
		<>
		<div className="screen">
			<Nav onChangeConsole={setActiveConsole} />

			<div className="grid-area">
				<div className="flex flex-col gap-4">
					<h1 className="text-5xl mt-2">Current Playlist</h1>
					{/* Component Area */}
					<div className="componentArea">
						{activePlaylist &&
						<Playlist
						playlist={activePlaylist}
						playlists={playlists}
						onDeleteTrack={handleDeleteTrack} />}
					</div>
					{/*<div className="componentArea">
						{activePlaylist &&
						<Playlist
						playlist={activePlaylist}
						playlists={playlists}
						setPlaylists={setPlaylists}
						setActivePlaylist={setActivePlaylist} />}
					</div>*/}
				</div>

				{/* Console Area */}
				<div className="console">
        			{activeConsole === 'playlists' &&
        			<PlaylistConsole
        			playlists={playlists}
        			onClickPlaylist={setActivePlaylist} />}
        			{activeConsole === 'search' &&
        			<SearchConsole
        			searchedTracks={searchedTracks}
        			onAddTrack={handleTrackAdd} />}
				</div>
			</div>
		</div>
		</>
	)
}

export default App;