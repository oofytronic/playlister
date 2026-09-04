import { faCopy } from '@fortawesome/free-solid-svg-icons';
import ComingSoon from '../components/ComingSoon.jsx';

function Duplicates() {
	return (
		<ComingSoon
			icon={faCopy}
			title="Duplicates"
			description="Find tracks that snuck into a playlist twice - including different versions of the same song - plus tracks that are region-locked or removed from Spotify entirely."
			bullets={[
				'Detect exact duplicate tracks within a playlist',
				'Detect same-song, different-version duplicates (remasters, live versions)',
				'Flag unavailable or region-locked tracks',
				'Bulk-remove duplicates and dead tracks in one pass',
			]}
		/>
	);
}

export default Duplicates;
