import { useState, useEffect } from 'react';
import Button from './Button.jsx';
import Track from './Track.jsx';

function SearchConsole({onAddTrack}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm) {
                handleSearch();
            }
            setIsSearching(false);
        }, 500);  // Wait 500ms after the user stops typing

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        if (!searchTerm) return;  // Avoid empty queries

        const token = window.localStorage.getItem('spotify_access_token');
        if (!token) {
            console.error('No access token available');
            return;
        }

        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=10`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error(`Failed to fetch: ${response.statusText}`);
            return;
        }

        const data = await response.json();
        setSearchResults(data.tracks.items);
    };

    return (
        <div className="search-console">
			<h2 className="text-4xl mt-2">Search Songs</h2>
			<input
			    type="search"
			    value={searchTerm}
			    onChange={handleSearchChange}
			    placeholder="Search tracks"
			/>
			<button onClick={handleSearch}>Search</button>

			<div className="flex flex-col gap-2">
			  {searchResults.map(track =>
			    <Track track={track} key={track.id}>
			      <Button label="Add" onClick={() => onAddTrack(track)} />
			    </Track>
			  )}
			</div>
        </div>
    );
}

export default SearchConsole;