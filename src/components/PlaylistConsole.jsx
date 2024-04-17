import { useState } from 'react';
import Button from './Button.jsx';
import Track from './Track.jsx';

function PlaylistConsole({playlists, onClickPlaylist}) {

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
          </div>
        </div>
    </>
  )
}

export default PlaylistConsole;