import { useState } from 'react';

import Track from './Track.jsx';
import Button from './Button.jsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

function Playlist({ playlist, onUpdatePlaylistName, onDeleteTrack, onDeletePlaylist, onTrackReorder }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(playlist.name);

    const handleNameChange = (event) => {
        setEditedName(event.target.value);
    };

    const saveNameChange = async () => {
        const token = window.localStorage.getItem('spotify_access_token');
        if (!token) {
            console.error('No access token available');
            return;
        }

        const updateUrl = `https://api.spotify.com/v1/playlists/${playlist.id}`;

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: editedName
            })
        };

        try {
            const response = await fetch(updateUrl, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

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
                    <Button label={<FontAwesomeIcon icon={faFloppyDisk} />} />
                    <Button label={<FontAwesomeIcon icon={faArrowsRotate} />} />
                    <Button className="bg-slate-950 border-2 rounded-md border-red-500 hover:bg-red-500 px-4 py-2" label="Delete Playlist" onClick={() => onDeletePlaylist(playlist.id)} />
                </div>
            </div>
            <div className="flex gap-2 py-2 px-4">
                <img className="rounded-md" style={{ width: '150px', height: '150px' }} src={playlist.thumbnail} alt="Playlist" />
                {isEditing ? (
                    <>
                        <input className="bg-slate-500 w-full p-3 rounded-md" type="text" value={editedName} onChange={handleNameChange} />
                        <Button label={<FontAwesomeIcon icon={faFloppyDisk} />} onClick={saveNameChange} />
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl">{playlist.name}</h2>
                        <Button label={<FontAwesomeIcon icon={faPenToSquare} />} onClick={() => setIsEditing(true)} />
                    </>
                )}
            </div>
            <div className="flex flex-col gap-4 w-full px-4">
                {playlist.tracks.map(track =>
                    <Track
                        track={track.track}
                        key={track.track.id}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}>
                        <Button label={<FontAwesomeIcon icon={faTrash} />} onClick={() => onDeleteTrack(playlist.id, track.track.id)} />
                        <Button label={<FontAwesomeIcon icon={faEllipsisVertical} />} />
                    </Track>
                )}
            </div>
        </div>
    );
}

export default Playlist;