import { useState } from 'react';

import Track from './Track.jsx';
import Button from './Button.jsx';

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
		<div className="playlist flex flex-col gap-2">
		  <div className="playlist-header">
		    <div style={{background: 'gray', width: '150px', height: '150px'}}></div>
		    {isEditing ? (
                <>
                    <input type="text" value={editedName} onChange={handleNameChange} />
                    <Button label="Save" onClick={saveNameChange} />
                </>
            ) : (
                <>
                    <h2 className="text-2xl">{playlist.name}</h2>
                    <Button label="Edit Name" onClick={() => setIsEditing(true)} />
                </>
            )}
		  </div>
		  <div>
		    <Button label="Save Playlist" />
		    <Button label="Sync With" />
		    <Button label="Delete Playlist" onClick={() => onDeletePlaylist(playlist.id)} />
		  </div>
		  {playlist.tracks.map(track =>
		    <Track 
		    	track={track}
		    	key={track.id}
		    	onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}>
		      <Button label="Change Order" />
		      <Button label="Delete" onClick={() => onDeleteTrack(playlist.id, track.id)} />
		    </Track>
		  )}
		</div>
	)
}

export default Playlist;