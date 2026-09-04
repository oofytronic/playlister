import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import ComingSoon from '../components/ComingSoon.jsx';

function OverlapFinder() {
	return (
		<ComingSoon
			icon={faLayerGroup}
			title="Overlap Finder"
			description="If you have five playlists that are basically the same playlist, this finds them so you can merge instead of maintaining duplicates."
			bullets={[
				'Compute track overlap percentage between every pair of playlists',
				'Rank the most similar playlist pairs',
				'Merge two playlists into one with a click',
			]}
		/>
	);
}

export default OverlapFinder;
