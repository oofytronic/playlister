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
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="font-bold text-4xl my-2">Playlists</h2>
                    <Button className="border-2 border-white rounded-md hover:bg-white hover:text-slate-950" label="New Playlist" onClick={() => setShowForm(true)} />
                </div>

                {showForm && (
                    <div className="flex flex-col gap-2">
                        <input
                            className="bg-slate-500 w-full p-3 rounded-md"
                            type="text"
                            placeholder="Enter playlist title"
                            value={playlistTitle}
                            onChange={(e) => setPlaylistTitle(e.target.value)}
                        />
                        <input
                            className="bg-slate-500 w-full p-3 rounded-md"
                            type="text"
                            placeholder="Thumbnail URL (optional)"
                            value={thumbnailUrl}
                            onChange={(e) => setThumbnailUrl(e.target.value)}
                        />
                        <Button className="border-2 border-white rounded-md hover:bg-white hover:text-slate-950" label="Create Playlist" onClick={handleCreatePlaylist} />
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {playlists.map(playlist =>
                        <div key={playlist.id} className="flex gap-4" onClick={() => onClickPlaylist(playlist)}>
                            <img className="flex-none bg-slate-500 w-12 h-12 rounded-md" src={playlist.images.length > 1 ? playlist.images[1].url : playlist.images[0].url} alt="Thumbnail" />
                            <p className="truncate">{playlist.name}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default PlaylistConsole;
