import { faStream } from '@fortawesome/free-solid-svg-icons';
import ComingSoon from '../components/ComingSoon.jsx';

function Timeline() {
	return (
		<ComingSoon
			icon={faStream}
			title="Timeline"
			description="A single, unified feed of everything added across all your playlists - plus liked tracks that never made it onto any playlist."
			bullets={[
				'Chronological feed of tracks added across every playlist',
				'Orphaned tracks: liked songs not on any playlist',
				'Jump straight from an entry to its playlist',
			]}
		/>
	);
}

export default Timeline;
