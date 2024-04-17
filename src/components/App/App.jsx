import { useState } from 'react';
import './App.css';

import Nav from '../Nav.jsx';
import Track from '../Track.jsx';
import Button from '../Button.jsx';
import Playlist from '../Playlist.jsx';

import SearchConsole from '../SearchConsole.jsx';

const tempTrackModel = [
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
];

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

const tempPlaylistModel = [
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
		name: 'Por Blue Vibes',
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

const App = () => {
	const [playlists, setPlaylists] = useState(tempPlaylistModel);
	const [playlistTracks, setPlaylistTracks] = useState(tempTrackModel);
	const [searchedTracks, setSearchedTracks] = useState(tempSearchModel);

	function handleTrackAdd(trackToAdd) {
		if (playlistTracks.find(track => track.id === trackToAdd.id)) {
	      alert('Track is already in the playlist');
	      return;
	    }

	    setPlaylistTracks(prevTracks => [...prevTracks, trackToAdd]);
	}

	function handleTrackDelete(trackId) {
		setPlaylistTracks(currentTracks => currentTracks.filter(track => track.id !== trackId));
	}

	return (
		<>
		<div className="screen">
			<Nav />
			<div className="grid-area">
				<div className="flex flex-col gap-4">
					<h1 className="text-5xl mt-2">Current Playlist</h1>
					{/* Component Area */}
					<div className="componentArea">
						<Playlist playlists={playlists} setPlaylists={setPlaylists} />
					</div>
				</div>

				{/* Console Area */}
				<div className="console">
					<SearchConsole searchedTracks={searchedTracks} onAddTrack={handleTrackAdd} />
				</div>
			</div>
		</div>
		</>
	)
}

export default App