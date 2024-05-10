import { useState } from 'react';
import Button from './Button.jsx';

function PlaylistConsole({playlists, onClickPlaylist, onAddPlaylist}) {
    const [showForm, setShowForm] = useState(false);

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="font-bold text-4xl my-2">Playlists</h2>
                    <Button className="border-2 border-white rounded-md hover:bg-white hover:text-slate-950" label="New Playlist" onClick={() => setShowForm(true)} />
                </div>

                {showForm && (
                    <form className="flex flex-col gap-2" onSubmit={onAddPlaylist}>
                      <label>
                        Title
                        <input
                          className="bg-slate-500 w-full p-3 rounded-md"
                          name="playlist_title"
                          type="text"
                          placeholder="Enter playlist title"
                        />
                      </label>

                      <label>
                        Description
                        <input
                          className="bg-slate-500 w-full p-3 rounded-md"
                          name="playlist_description"
                          type="text"
                          placeholder="Describe your playlist"
                        />
                      </label>

                      <label>
                        Thumbnail
                        <input
                          className="bg-slate-500 w-full p-3 rounded-md"
                          name="playlist_thumbnail"
                          type="text"
                          placeholder="Thumbnail URL (optional)"
                        />
                      </label>

                      <label className="flex gap-2 items-center">
                        Public
                        <input type="checkbox" name="public" defaultChecked />
                      </label>

                      <button type="submit" className="mt-4 border-2 border-white rounded-md hover:bg-white hover:text-slate-950 px-4 py-2">
                        Create Playlist
                      </button>
                    </form>
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
