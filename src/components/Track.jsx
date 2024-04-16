import { useState } from 'react';

function Track({track, children}) {
	return (
		<div className="track">
			<div className="track-info">
				<p>{track.song}</p>
				<p>{track.artist}</p>
			</div>

			{children}
		</div>
	)
}

export default Track;