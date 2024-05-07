import { useState } from 'react';

function Track({track, children, onDragStart, onDragOver, onDrop}) {
	return (
		<div className="grid grid-cols-3 justify-between w-full" draggable onDragStart={(e) => onDragStart(e, track)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, track)}>
			<div className="col-span-2 flex flex-col gap-1">
				<p classNamet="truncate">{track.name}</p>
				<p className="text-slate-400 truncate">{track.artists.map(artist => <span>{artist.name}</span>)}</p>
			</div>
			<div className="col-span-1 flex justify-end items-center">
				{children}
			</div>
		</div>
	)
}

export default Track;