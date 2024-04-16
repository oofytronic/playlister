import { useState } from 'react';
import './App.css';

import Nav from '../Nav.jsx';
import Track from '../Track.jsx';

const tempTrackModel = [
{
song: 'Fireflies',
artist: 'Owl City'
},
{
song: 'Montana',
artist: 'Owl City'
},
{
song: 'Dinosaur Park',
artist: 'Owl City'
},
{
song: 'Cave In',
artist: 'Owl City'
},
{
song: 'Vanilla Twilight',
artist: 'Owl City'
}
];

const App = () => {
	const [playlistTracks, setPlaylistTracks] = useState(tempTrackModel);

	return (
		<>
		<div className="screen">
			<Nav />
			<div className="grid-area">
				<div>
					<h1 style={{textAlign: 'center'}}>Current Playlist</h1>
					{/* Component Area */}
					<div className="componentArea">
						<div className="playlist">
							<div className="playlist-header">
								<div style={{background: 'gray', width: '150px', height: '150px'}}></div>
								<h2>Playlist Title</h2>
							</div>
							{playlistTracks.map(track => <Track track={track} key={track.song} />)}
						</div>
					</div>
				</div>

				{/* Console Area */}
				<div className="console">
					<div className="search-console">
						<h2>Search Songs</h2>
						<input type="search" />

						<div>
							{playlistTracks.map(track => <Track track={track} key={track.song} />)}
						</div>
					</div>
				</div>
			</div>
		</div>
		</>
	)
}

export default App