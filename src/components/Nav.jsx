import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SpotifyLoginButton from './SpotifyLoginButton.jsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faGaugeHigh, faList, faClockRotateLeft, faUserSlash, faCopy, faLayerGroup, faListCheck, faStream, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

const TOOLS = [
	{ to: '/dashboard', label: 'Dashboard', icon: faGaugeHigh },
	{ to: '/playlists', label: 'Playlists', icon: faList },
	{ to: '/backups', label: 'Backups', icon: faClockRotateLeft },
	{ to: '/ghost-follows', label: 'Ghost Follows', icon: faUserSlash },
	{ to: '/duplicates', label: 'Duplicates', icon: faCopy },
	{ to: '/overlap-finder', label: 'Overlap Finder', icon: faLayerGroup },
	{ to: '/bulk-actions', label: 'Bulk Actions', icon: faListCheck },
	{ to: '/timeline', label: 'Timeline', icon: faStream },
];

const linkClasses = ({ isActive }) =>
	`flex items-center gap-2 rounded-md px-3 py-2 w-full transition-colors ${
		isActive ? 'bg-emerald-400 text-slate-950 font-semibold' : 'hover:bg-slate-800'
	}`;

function Nav({ variant = 'app' }) {
	const { user, isAuthenticated, logout } = useAuth();

	if (variant === 'landing') {
		return (
			<nav className="flex flex-col items-center gap-4 bg-gradient-to-br from-slate-950 to-slate-900 border-white border-2 rounded-md p-4 w-full max-w-sm">
				<div className="flex flex-col items-center">
					<div className="flex gap-2 items-center">
						<FontAwesomeIcon icon={faMusic} />
						<p><a href="/" className="font-black text-2xl">BridgeBeat</a></p>
					</div>
					<p>0.3.0 | Alpha</p>
				</div>

				<SpotifyLoginButton />

				<div className="flex gap-1 text-sm">
					<p>Made to Fly by</p>
					<a href="https://feathermode.com"><img className="w-6" src="/oof-icon.svg" alt="@oofbetold" /></a>
				</div>
			</nav>
		);
	}

	return (
		<nav className="flex flex-col justify-between gap-4 bg-gradient-to-br from-slate-950 to-slate-900 border-white border-2 rounded-md p-4 w-56 flex-none h-full overflow-y-auto">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col items-center">
					<div className="flex gap-2 items-center">
						<FontAwesomeIcon icon={faMusic} />
						<p><a href="/" className="font-black text-2xl">BridgeBeat</a></p>
					</div>
					<p className="text-xs text-slate-400">0.3.0 | Alpha</p>
				</div>

				{isAuthenticated && (
					<ul className="flex flex-col gap-1">
						{TOOLS.map((tool) => (
							<li key={tool.to}>
								<NavLink to={tool.to} className={linkClasses}>
									<FontAwesomeIcon icon={tool.icon} className="w-4" />
									<span>{tool.label}</span>
								</NavLink>
							</li>
						))}
					</ul>
				)}
			</div>

			<div className="flex flex-col gap-3">
				{user && (
					<div className="flex flex-col items-start gap-1">
						<div className="flex items-center gap-1">
							<FontAwesomeIcon icon={faSpotify} className="text-emerald-400" />
							<p className="text-emerald-400 truncate">{user.display_name}</p>
						</div>
						<button className="flex items-center gap-2 text-slate-400 hover:text-white text-sm" onClick={logout}>
							<FontAwesomeIcon icon={faRightFromBracket} />
							<span>Log out</span>
						</button>
					</div>
				)}

				<div className="flex gap-1 text-xs text-slate-400">
					<p>Made to Fly by</p>
					<a href="https://feathermode.com"><img className="w-4" src="/oof-icon.svg" alt="@oofbetold" /></a>
				</div>
			</div>
		</nav>
	);
}

export default Nav;
