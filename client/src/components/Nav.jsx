import { useState } from 'react';
import Button from './Button';
import SpotifyAuth from './SpotifyAuth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

function Nav({user}) {

	return (
		<nav className={ user ? "flex flex-col items-center justify-between gap-2 bg-gradient-to-br from-slate-950 to-slate-900 border-white border-2 rounded-md p-4" : "flex flex-col items-center justify-between gap-2 bg-gradient-to-br from-slate-950 to-slate-900 border-white border-2 rounded-md p-4 h-2/4 w-2/4" }>
			<div className="flex flex-col items-center gap-4">
				<div className="flex flex-col items-center">
					<div className="flex gap-2 items-center">
						<FontAwesomeIcon icon={faMusic} />
						<p><a href="/" className="font-black text-2xl">BridgeBeat</a></p>
					</div>
					<p>0.2.0 | Alpha</p>
				</div>

				<ul className="flex flex-col items-center text-center gap-2">
					{user ? (
					    <div className="flex flex-col items-start gap-1"><FontAwesomeIcon icon={faSpotify} className="text-emerald-400" /><p className="text-emerald-400">{user.display_name}</p></div>
						) : (
						<li><SpotifyAuth /></li>
						)
					}
				</ul>
			</div>

			<div className="flex gap-1">
				<p>Made to Fly by</p>
				<a href="https://feathermode.com"><img className="w-6" src="./oof-icon.svg" alt="@oofbetold" /></a>
			</div>
		</nav>
	)
}

export default Nav;