import { useState } from 'react';
import Button from './Button.jsx';

function PlaylistConsole({playlists, onClickPlaylist, onAddPlaylist}) {
    const [showForm, setShowForm] = useState(false);
    const [playlistTitle, setPlaylistTitle] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');

    const handleCreatePlaylist = () => {
        if (!playlistTitle) return; // Ensure there is a title

        const newPlaylist = {
            id: `playlist${playlists.length + 1}`, // Generating a simple unique ID
            name: playlistTitle,
            thumbnail: thumbnailUrl,
            tracks: []
        };
        onAddPlaylist(newPlaylist);
        onClickPlaylist(newPlaylist); // Set the new playlist as active
        setPlaylistTitle(''); // Reset form fields
        setThumbnailUrl('');
        setShowForm(false); // Hide form after creation
    };

    return (
        <>
            <div className="search-console">
                <h2 className="text-5xl mt-2">Playlists</h2>

                <div className="flex flex-col gap-2">
                    {playlists.map(playlist =>
                        <div key={playlist.id} className="flex gap-4" onClick={() => onClickPlaylist(playlist)}>
                            <div style={{background: 'gray', width: '50px', height: '50px'}}></div>
                            <p>{playlist.name}</p>
                        </div>
                    )}
                    <Button label="New Playlist" onClick={() => setShowForm(true)} />
                </div>
            </div>
            {showForm && (
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Enter playlist title"
                        value={playlistTitle}
                        onChange={(e) => setPlaylistTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Thumbnail URL (optional)"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                    />
                    <Button label="Create Playlist" onClick={handleCreatePlaylist} />
                </div>
            )}
        </>
    );
}

export default PlaylistConsole;
