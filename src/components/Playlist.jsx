import { useState } from 'react';

import Track from './Track.jsx';
import Button from './Button.jsx';
import { spotifyFetch } from '../lib/spotifyClient.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

function Playlist({ user, playlist, onUpdatePlaylistName, onDeleteTrack, onDeletePlaylist, onTrackReorder }) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedName, setEditedName] = useState(playlist.name);

    let isUser;

	if (user.id !== playlist.owner) {
		isUser = false;
	} else {
		isUser = true;
	}

	const handleNameChange = (event) => {
		setEditedName(event.target.value);
	};

	const saveNameChange = async () => {
		try {
			await spotifyFetch(`/playlists/${playlist.id}`, {
				method: 'PUT',
				body: JSON.stringify({ name: editedName }),
			});

			// Call onUpdatePlaylistName to update the local state if necessary
			onUpdatePlaylistName(playlist.id, editedName);
			setIsEditing(false);
		} catch (error) {
			console.error('Failed to update playlist name:', error);
		}
	};

	const handleDragStart = (e, track) => {
		e.dataTransfer.setData("trackId", track.id);
	};

	const handleDrop = (e, targetTrack) => {
		e.preventDefault();
		const draggedTrackId = e.dataTransfer.getData("trackId");
		if (draggedTrackId !== targetTrack.id) {
			onTrackReorder(draggedTrackId, targetTrack.id);
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault(); // Necessary to allow dropping
	};

	return (
		<div className="relative flex flex-col gap-2 color-white w-full">
			<div className="bg-gradient-to-b from-70% from-slate-950/80 to-transparent sticky top-0 flex justify-between w-full py-4 px-4">
				<h1 className="text-4xl mt-2 font-bold">Current Playlist</h1>

				<div className="flex gap-2 items-center">
					{/*<Button label={<FontAwesomeIcon icon={faFloppyDisk} />} />
					<Button label={<FontAwesomeIcon icon={faArrowsRotate} />} />*/}
					{isUser ? <Button className="bg-slate-950 border-2 rounded-md border-red-500 hover:bg-red-500 px-4 py-2" label="Delete Playlist" onClick={() => onDeletePlaylist(playlist.id)} /> : ''}
				</div>
			</div>
			<div className="flex gap-2 py-2 px-4">
				<img className="bg-slate-500 rounded-md" style={{ width: '150px', height: '150px' }} src={playlist.thumbnail} alt="Playlist" />
				{isEditing ? (
					<>
						<input className="bg-slate-500 w-full p-3 rounded-md" type="text" value={editedName} onChange={handleNameChange} />
						<Button label={<FontAwesomeIcon icon={faFloppyDisk} />} onClick={saveNameChange} />
					</>
				) : (
					<>
						<h2 className="text-2xl font-semibold">{playlist.name}</h2>
						{isUser ? <Button label={<FontAwesomeIcon icon={faPenToSquare} />} onClick={() => setIsEditing(true)} /> : ''}
					</>
				)}
			</div>
			<div className="flex flex-col gap-4 w-full px-4">
				{Array.isArray(playlist.tracks) ? playlist.tracks.map(track =>
					<Track
						track={track.track}
						key={track.track.id}
						onDragStart={handleDragStart}
						onDragOver={handleDragOver}
						onDrop={handleDrop}>
						{isUser ? <Button label={<FontAwesomeIcon icon={faTrash} />} onClick={() => onDeleteTrack(playlist.id, track.track.id)} /> : ""}
						{ /* {isUser ? <Button label={<FontAwesomeIcon icon={faEllipsisVertical} />} /> : ''} */}
					</Track>
				) : ''}
			</div>
		</div>
	);
}

export default Playlist;