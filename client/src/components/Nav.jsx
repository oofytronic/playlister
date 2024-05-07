import { useState } from 'react';
import Button from './Button';
import SpotifyAuth from './SpotifyAuth';

function Nav({onChangeConsole}) {

	return (
		<nav className="flex flex-col items-center gap-2 border-white border-2 rounded-md p-4">
			<p><a href="/" className="font-black text-2xl">BridgeBeat</a></p>

			<ul className="flex flex-col items-center gap-2">
				<li><SpotifyAuth /></li>
				<li><Button label="+ Stream" /></li>
			</ul>
		</nav>
	)
}

export default Nav;