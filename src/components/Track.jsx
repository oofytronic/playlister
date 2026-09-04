function Track({track, children, onDragStart, onDragOver, onDrop}) {
	if (!track) {
		return (
			<div className="grid grid-cols-3 justify-between w-full text-slate-500 italic">
				<p className="col-span-2 truncate">Unavailable track</p>
			</div>
		);
	}

	const subtitle = Array.isArray(track.artists) && track.artists.length > 0
		? track.artists.map((artist) => artist.name).join(', ')
		: track.show?.name || 'Unknown artist';

	return (
		<div className="grid grid-cols-3 justify-between w-full" draggable onDragStart={(e) => onDragStart(e, track)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, track)}>
			<div className="col-span-2 flex flex-col gap-1">
				<p className="truncate font-semibold">{track.name}</p>
				<p className="text-slate-400 truncate">{subtitle}</p>
			</div>
			<div className="col-span-1 flex justify-end items-center">
				{children}
			</div>
		</div>
	)
}

export default Track;
