import { useState } from 'react';

function Track({track, children, onDragStart, onDragOver, onDrop}) {
	return (
		<div className="track" draggable onDragStart={(e) => onDragStart(e, track)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, track)}>
			<div className="track-info">
				<p>{track.song}</p>
				<p>{track.artist}</p>
			</div>
			<div>
			{children}
			</div>
		</div>
	)
}

export default Track;