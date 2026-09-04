import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import ComingSoon from '../components/ComingSoon.jsx';

function Backups() {
	return (
		<ComingSoon
			icon={faClockRotateLeft}
			title="Backups"
			description="Spotify has no undo. This snapshots your playlists locally in your browser so you can see what changed and restore what got removed."
			bullets={[
				'Snapshot every playlist each time you open BridgeBeat',
				'Diff the current playlist against your last snapshot',
				'Restore individual tracks that were removed',
				'All stored locally on this device via IndexedDB - nothing leaves your browser',
			]}
		/>
	);
}

export default Backups;
