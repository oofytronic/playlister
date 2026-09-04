import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faClockRotateLeft, faUserSlash, faCopy, faLayerGroup, faListCheck, faStream } from '@fortawesome/free-solid-svg-icons';

const CARDS = [
	{ to: '/playlists', label: 'Playlists', icon: faList, description: 'Browse, create, and edit your playlists directly.' },
	{ to: '/backups', label: 'Backups', icon: faClockRotateLeft, description: 'Snapshot playlists locally and restore what changed.' },
	{ to: '/ghost-follows', label: 'Ghost Follows', icon: faUserSlash, description: 'Artists you follow but never actually listen to.' },
	{ to: '/duplicates', label: 'Duplicates', icon: faCopy, description: 'Find repeated or dead tracks across your playlists.' },
	{ to: '/overlap-finder', label: 'Overlap Finder', icon: faLayerGroup, description: 'Spot near-duplicate playlists worth merging.' },
	{ to: '/bulk-actions', label: 'Bulk Actions', icon: faListCheck, description: 'Multi-select unfollow, unlike, and remove.' },
	{ to: '/timeline', label: 'Timeline', icon: faStream, description: 'A unified view of everything added recently.' },
];

function Dashboard() {
	const { user } = useAuth();

	return (
		<div className="flex flex-col gap-4 p-4">
			<div className="bg-gradient-to-b from-70% from-slate-950/80 to-transparent sticky top-0 py-2">
				<h1 className="text-4xl font-bold">Welcome{user ? `, ${user.display_name}` : ''}</h1>
				<p className="text-slate-400">Pick a tool below to start cleaning up your Spotify.</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{CARDS.map((card) => (
					<Link
						key={card.to}
						to={card.to}
						className="flex flex-col gap-2 border-2 border-white rounded-md p-4 hover:bg-white hover:text-slate-950 transition-colors"
					>
						<FontAwesomeIcon icon={card.icon} className="text-emerald-400 text-xl" />
						<p className="font-semibold text-lg">{card.label}</p>
						<p className="text-sm opacity-80">{card.description}</p>
					</Link>
				))}
			</div>
		</div>
	);
}

export default Dashboard;
