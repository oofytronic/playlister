import { useState } from 'react';

function Nav({onChangeConsole}) {

	return (
		<nav className="main-nav">
			<p><a href="/">BridgeBeat</a></p>

			<ul>
				<li><button onClick={() => onChangeConsole('playlists')}>Playlists</button></li>
				<li><button onClick={() => onChangeConsole('search')}>Search</button></li>
			</ul>
		</nav>
	)
}

export default Nav;