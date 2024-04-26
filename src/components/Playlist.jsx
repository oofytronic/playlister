import { useState } from 'react';

import Track from './Track.jsx';
import Button from './Button.jsx';

function Playlist({playlist, playlists, onDeleteTrack}) {

  return (
    <div className="playlist flex flex-col gap-2">
      <div className="playlist-header">
        <div style={{background: 'gray', width: '150px', height: '150px'}}></div>
        <h2 className="text-2xl">{playlist.name}</h2>
      </div>
      <div>
        <Button label="Save Playlist" />
        <Button label="Sync With" />
      </div>
      {playlist.tracks.map(track =>
        <Track track={track} key={track.id}>
          <Button label="Change Order" />
          <Button label="Delete" onClick={() => onDeleteTrack(playlist.id, track.id)} />
        </Track>
      )}
    </div>
  )
}

export default Playlist;