import { useState, useEffect } from 'react';
import Button from './Button.jsx';
import Track from './Track.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
        <div className="flex flex-col gap-4 w-full px-4">
            <div className="flex flex-col">
    			<h2 className="font-bold text-4xl my-2">Search Songs</h2>
                <div className="flex gap-1 w-full">
        			<input
                        className="bg-slate-500 w-full p-3 rounded-md"
        			    type="search"
        			    value={searchTerm}
        			    onChange={handleSearchChange}
        			    placeholder="Search tracks"
        			/>
                </div>
            </div>

			<div className="flex flex-col gap-4">
			  {searchResults.map(track =>
			    <Track track={track} key={track.id}>
			      <Button label={<FontAwesomeIcon icon={faPlus} />} onClick={() => onAddTrack(track)} />
			    </Track>
			  )}
			</div>
        </div>
    );
}

export default SearchConsole;