import { useState } from 'react';
import Button from './Button';
import SpotifyAuth from './SpotifyAuth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

function Nav({onChangeConsole}) {

	return (
		<nav className="flex flex-col items-center justify-between gap-2 bg-gradient-to-br from-slate-950 to-slate-900 border-white border-2 rounded-md p-4">
			<div className="flex flex-col items-center gap-4">
				<div className="flex flex-col items-center">
					<div className="flex gap-2 items-center">
						<FontAwesomeIcon icon={faMusic} />
						<p><a href="/" className="font-black text-2xl">BridgeBeat</a></p>
					</div>
					<p>0.1.0 | Alpha</p>
				</div>

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