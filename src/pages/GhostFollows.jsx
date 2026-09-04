import { faUserSlash } from '@fortawesome/free-solid-svg-icons';
import ComingSoon from '../components/ComingSoon.jsx';

function GhostFollows() {
	return (
		<ComingSoon
			icon={faUserSlash}
			title="Ghost Follows"
			description="Spotify never shows you who you follow but don't actually listen to. This cross-references your followed artists against your recently-played and top-artists history."
			bullets={[
				"Flag followed artists absent from your recent listening history",
				'Sort by how long it has been since they last showed up',
				'Bulk unfollow the ones you no longer care about',
			]}
		/>
	);
}

export default GhostFollows;
