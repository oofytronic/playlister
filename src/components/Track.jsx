import { useState } from 'react';

function Track({track}) {

	return (
		<div className="track">
			<div className="track-info">
				<p>{track.song}</p>
				<p>{track.artist}</p>
			</div>

			<button>Delete</button>
		</div>
	)
}

export default Track;