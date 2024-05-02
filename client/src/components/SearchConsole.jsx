import { useState } from 'react';
import Button from './Button.jsx';
import Track from './Track.jsx';

function SearchConsole({searchedTracks, onAddTrack}) {

  return (
    <>
      <div className="search-console">
          <h2 className="text-5xl mt-2">Search Songs</h2>
          <input type="search" />

          <div className="flex flex-col gap-2">
            {searchedTracks.map(track =>
              <Track track={track} key={track.id}>
                <Button label="Add" onClick={() => onAddTrack(track)} />
              </Track>
            )}
          </div>
        </div>
    </>
  )
}

export default SearchConsole;