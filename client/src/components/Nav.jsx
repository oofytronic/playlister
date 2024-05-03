import { useState } from 'react';
import SpotifyAuth from './SpotifyAuth';

function Nav({onChangeConsole}) {
	const AUTH_URL = 'https://accounts.spotify.com/authorize?client_id=899a0e6b070d4b6eae06711c13eddd13&response_type=code&redirect_uri=http://localhost:5173&scope=ugc-image-upload%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public%20user-library-modify%20user-library-read%20user-read-email%20user-read-private';

	return (
		<nav className="main-nav">
			<p><a href="/">BridgeBeat</a></p>

			<ul>
				<li><button onClick={() => onChangeConsole('playlists')}>Playlists</button></li>
				<li><button onClick={() => onChangeConsole('search')}>Search</button></li>
				<li><SpotifyAuth /></li>
			</ul>
		</nav>
	)
}

export default Nav;