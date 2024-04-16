import { useState } from 'react';
import './App.css';

import Nav from '../Nav.jsx';
import Track from '../Track.jsx';
import Button from '../Button.jsx';

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

const App = () => {
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
					<h1 className="text-5xl">Current Playlist</h1>
					{/* Component Area */}
					<div className="componentArea">
						<div className="playlist flex flex-col gap-2">
							<div className="playlist-header">
								<div style={{background: 'gray', width: '150px', height: '150px'}}></div>
								<h2 className="text-2xl">Playlist Title</h2>
							</div>
							{playlistTracks.map(track =>
								<Track track={track} key={track.id}>
									<Button label="Delete" onClick={() => handleTrackDelete(track.id)} />
								</Track>
							)}
						</div>
					</div>
				</div>

				{/* Console Area */}
				<div className="console">
					<div className="search-console">
						<h2>Search Songs</h2>
						<input type="search" />

						<div className="flex flex-col gap-2">
							{searchedTracks.map(track =>
								<Track track={track} key={track.id}>
									<Button label="Add" onClick={() => handleTrackAdd(track)} />
								</Track>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
		</>
	)
}

export default App