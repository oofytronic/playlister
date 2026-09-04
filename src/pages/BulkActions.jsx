import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import ComingSoon from '../components/ComingSoon.jsx';

function BulkActions() {
	return (
		<ComingSoon
			icon={faListCheck}
			title="Bulk Actions"
			description="Spotify makes you unfollow, unlike, and remove one thing at a time. This adds multi-select everywhere."
			bullets={[
				'Multi-select artists to unfollow',
				'Multi-select liked songs to remove',
				'Multi-select tracks across playlists to remove',
			]}
		/>
	);
}

export default BulkActions;
