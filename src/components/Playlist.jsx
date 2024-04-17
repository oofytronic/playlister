import { useState } from 'react';

import Track from './Track.jsx';
import Button from './Button.jsx';

function Playlist({playlist, playlists, setPlaylists, setActivePlaylist}) {

  const addPlaylist = (newPlaylist) => {
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
  };

  const updatePlaylist = (updatedPlaylist) => {
    setPlaylists(prev => prev.map(playlist => playlist.id === updatedPlaylist.id ? updatedPlaylist : playlist));
  };

  const addTrackToPlaylist = (playlists, playlistId, newTrack) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          tracks: [...playlist.tracks, newTrack]
        };
      }
      return playlist;
    }));
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          tracks: playlist.tracks.filter(track => track.id !== trackId)
        };
      }
      return playlist;
    }));

    // setActivePlaylist(prev => prev.find(playlist => playlist.id === playlistId));
  };

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
          <Button label="Delete" onClick={() => removeTrackFromPlaylist(playlist.id, track.id)} />
        </Track>
      )}
    </div>
  )
}

export default Playlist;