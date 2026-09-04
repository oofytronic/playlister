import { useState, useEffect } from 'react';
import Button from './Button.jsx';
import Track from './Track.jsx';
import { spotifyFetch } from '../lib/spotifyClient.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function SearchConsole({onAddTrack}) {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	useEffect(() => {
		if (!searchTerm) {
			setSearchResults([]);
			return;
		}

		const delayDebounce = setTimeout(async () => {
			try {
				const data = await spotifyFetch(`/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=10`);
				setSearchResults(data.tracks.items);
			} catch (error) {
				console.error('Search failed:', error);
			}
		}, 500); // Wait 500ms after the user stops typing

		return () => clearTimeout(delayDebounce);
	}, [searchTerm]);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
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