import { useState } from 'react';

import Track from './Track.jsx';
import Button from './Button.jsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

function Playlist({playlist, playlists, onUpdatePlaylistName, onDeleteTrack, onDeletePlaylist, onTrackReorder}) {
	const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(playlist.name);

    const handleNameChange = (event) => {
        setEditedName(event.target.value);
    };

    const saveNameChange = () => {
        onUpdatePlaylistName(playlist.id, editedName);
        setIsEditing(false);
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
			<div className="bg-gradient-to-b from-slate-950 from-70% to-transparent sticky top-0 flex justify-between w-full py-4">
				<h1 className="text-4xl mt-2 font-bold">Current Playlist</h1>

				<div className="flex gap-2 items-center">
				    <Button label={<FontAwesomeIcon icon={faFloppyDisk} />} />
				    <Button label={<FontAwesomeIcon icon={faArrowsRotate} />} />
				    <Button className="bg-slate-950 border-2 rounded-md border-red-500 hover:bg-red-500 px-4 py-2" label="Delete Playlist" onClick={() => onDeletePlaylist(playlist.id)} />
				</div>
			</div>
		  <div className="flex gap-2 py-2">
		    <img className="rounded-md" style={{width: '150px', height: '150px'}} src={playlist.thumbnail} />
		    {isEditing ? (
                <>
                    <input type="text" value={editedName} onChange={handleNameChange} />
                    <Button label={<FontAwesomeIcon icon={faFloppyDisk} />} onClick={saveNameChange} />
                </>
            ) : (
                <>
                    <h2 className="text-2xl">{playlist.name}</h2>
                    <Button label={<FontAwesomeIcon icon={faPenToSquare} />} onClick={() => setIsEditing(true)} />
                </>
            )}
		  </div>
		  <div className="flex flex-col gap-4 w-full">
		  {playlist.tracks.map(track =>
		    <Track 
		    	track={track.track}
		    	key={track.track.id}
		    	onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}>
		      <Button label={<FontAwesomeIcon icon={faTrash} />} onClick={() => onDeleteTrack(playlist.id, track.id)} />
		      <Button label={<FontAwesomeIcon icon={faEllipsisVertical} />} />
		    </Track>
		  )}
		  </div>
		</div>
	)
}

export default Playlist;