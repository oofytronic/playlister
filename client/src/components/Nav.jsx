import { useState } from 'react';
import Button from './Button';
import SpotifyAuth from './SpotifyAuth';

function Nav({onChangeConsole}) {

	return (
		<nav className="flex flex-col items-center justify-between gap-2 border-white border-2 rounded-md p-4">
			<div className="flex flex-col items-center gap-2">
				<p><a href="/" className="font-black text-2xl">BridgeBeat</a></p>

				<ul className="flex flex-col items-center text-center gap-2">
					<li><SpotifyAuth /></li>
				</ul>
			</div>

			<div className="flex gap-1">
				<p>Made to Fly by</p>
				<a href="https://feathermode.com"><img className="w-6" src="./feathermode-icon.png" alt="feathermode" /></a>
			</div>
		</nav>
	)
}

export default Nav;