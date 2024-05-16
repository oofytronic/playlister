import React, { useState, useEffect } from 'react';
import './App.css';
import Nav from '../Nav.jsx';
import Playlist from '../Playlist';
import PlaylistConsole from '../PlaylistConsole';
import SearchConsole from '../SearchConsole';
import Button from '../Button';
import Track from '../Track';

function App() {
	const [user, setUser] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [activeConsole, setActiveConsole] = useState('');
    const [activePlaylist, setActivePlaylist] = useState(null);

	const fetchUser = async () => {
	  const token = window.localStorage.getItem('spotify_access_token');

	  if (!token) {
	    console.log('No access token available');
	    return;
	  }

	  const requestOptions = {
	    method: 'GET',
	    headers: {
	      'Authorization': `Bearer ${token}`,
	      'Content-Type': 'application/json'
	    }
	  };

	  try {
	    const response = await fetch('https://api.spotify.com/v1/me', requestOptions);
	    if (!response.ok) {
	      throw new Error(`HTTP error! Status: ${response.status}`);
	    }
	    const data = await response.json();
	    console.log('User Data:', data);

	    // Process the data as needed
	    return data;
	  } catch (error) {
	    console.error('Failed to fetch user data:', error);
	  }
	};
	
    const fetchUserPlaylists = async () => {
	    const token = window.localStorage.getItem('spotify_access_token'); // Get the stored token
	    if (!token) {
	        console.log('No token available');
	        return [];
	    }

	    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
	        headers: {
	            'Authorization': `Bearer ${token}`
	        }
	    });

	    if (!response.ok) {
	        throw new Error(`HTTP error! Status: ${response.status}`);
	    }

	    const data = await response.json();
	    return data.items;
	};

    const onUpdatePlaylistName = (playlistId, newName) => {
	    const updatedPlaylists = playlists.map(playlist => {
	        if (playlist.id === playlistId) {
	            return { ...playlist, name: newName };
	        }
	        return playlist;
	    });
	    setPlaylists(updatedPlaylists);

	    // Update activePlaylist if it's the one being edited
	    if (activePlaylist && activePlaylist.id === playlistId) {
	        setActivePlaylist(prev => ({ ...prev, name: newName }));
	    }

	    console.log('Playlist name updated successfully');
	};

	const handleAddTrackToPlaylist = async (track) => {
	    if (!activePlaylist) {
	        alert('No Active Playlist. Please select a playlist before adding a song.');
	        return;
	    }

	    // Initialize tracks as an empty array if it does not exist or is not iterable
	    if (!Array.isArray(activePlaylist.tracks)) {
	        console.error('Current activePlaylist.tracks is not an array:', activePlaylist.tracks);
	        activePlaylist.tracks = [];
	    }

	    // Check for existing Spotify track in the playlist to avoid duplicates
	    if (activePlaylist.tracks.find(t => t.track.id === track.id)) {
	        alert('Track already exists in the playlist');
	        return;
	    }

	    const token = window.localStorage.getItem('spotify_access_token');
	    if (!token) {
	        console.error('No access token available');
	        return;
	    }

	    // Spotify API endpoint to add tracks to the playlist
	    const addTrackUrl = `https://api.spotify.com/v1/playlists/${activePlaylist.id}/tracks`;

	    // Construct the request body and headers
	    const requestOptions = {
	        method: 'POST',
	        headers: {
	            'Authorization': `Bearer ${token}`,
	            'Content-Type': 'application/json'
	        },
	        body: JSON.stringify({
	            uris: [track.uri] // Spotify expects an array of track URIs
	        })
	    };

	    try {
	        const response = await fetch(addTrackUrl, requestOptions);
	        if (!response.ok) {
	            throw new Error(`HTTP error! Status: ${response.status}`);
	        }

	        // Use the correct structure to update the local state with the new track URI
	        const updatedTrack = { track: { uri: track.uri, id: track.id, name: track.name, artists: track.artists } };

	        // Update local playlists and activePlaylist
	        const updatedPlaylists = playlists.map(playlist => {
	            if (playlist.id === activePlaylist.id) {
	                // Ensure playlist.tracks is an array
	                let newTracks = Array.isArray(playlist.tracks) ? [...playlist.tracks] : [];
	                newTracks.push(updatedTrack); // Use the structure with track object containing the URI
	                return { ...playlist, tracks: newTracks };
	            }

	            return playlist;
	        });

	        setPlaylists(updatedPlaylists);

	        // Update activePlaylist to trigger re-render
	        setActivePlaylist(prev => ({
	            ...prev,
	            tracks: [...(prev.tracks || []), updatedTrack] // Ensure prev.tracks is treated safely
	        }));

	        console.log('Track added successfully');
	    } catch (error) {
	        console.error('Failed to add track:', error);
	    }
	};

    const handleDeleteTrack = async (playlistId, trackId) => {
	    const token = window.localStorage.getItem('spotify_access_token');
	    if (!token) {
	        console.error('No access token available');
	        return;
	    }

	    // Ensure playlist.tracks is treated as an array
	    const tracks = Array.isArray(activePlaylist.tracks) ? activePlaylist.tracks : [];
	    const track = tracks.find(t => t.track.id === trackId);
	    if (!track) {
	        console.error('Track not found');
	        return;
	    }

	    // Spotify API endpoint to remove tracks from a playlist
	    const deleteUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

	    const requestOptions = {
	        method: 'DELETE',
	        headers: {
	            'Authorization': `Bearer ${token}`,
	            'Content-Type': 'application/json'
	        },
	        body: JSON.stringify({
	            tracks: [{ uri: track.track.uri }]
	        })
	    };

	    try {
	        const response = await fetch(deleteUrl, requestOptions);
	        if (!response.ok) {
	            throw new Error(`HTTP error! Status: ${response.status}`);
	        }

	        // Update local state only if the Spotify API call was successful
	        const updatedPlaylists = playlists.map(p => {
	            if (p.id === playlistId) {
	                const updatedTracks = tracks.filter(t => t.track.id !== trackId);
	                return { ...p, tracks: updatedTracks };
	            }
	            return p;
	        });

	        setPlaylists(updatedPlaylists);

	        // Update activePlaylist to trigger re-render
	        if (activePlaylist && activePlaylist.id === playlistId) {
	            setActivePlaylist({
	                ...activePlaylist,
	                tracks: activePlaylist.tracks.filter(t => t.track.id !== trackId)
	            });
	        }

	        console.log('Track deleted successfully');
	    } catch (error) {
	        console.error('Failed to delete track:', error);
	    }
	};

	const handleDeletePlaylist = async (playlistId) => {
		const isConfirmed = window.confirm('Are you sure you want to delete this playlist?');

		if (!isConfirmed) {
			return;
		}
	    const token = window.localStorage.getItem('spotify_access_token');
	    if (!token) {
	      console.error('No access token available');
	      return;
	    }

	    const deleteUrl = `https://api.spotify.com/v1/playlists/${playlistId}/followers`;

	    const requestOptions = {
	      method: 'DELETE',
	      headers: {
	        'Authorization': `Bearer ${token}`,
	        'Content-Type': 'application/json'
	      }
	    };

	    try {
	      const response = await fetch(deleteUrl, requestOptions);
	      if (!response.ok) {
	        throw new Error(`HTTP error! Status: ${response.status}`);
	      }

	      // Update local state only if the Spotify API call was successful
	      const updatedPlaylists = playlists.filter(playlist => playlist.id !== playlistId);
	      setPlaylists(updatedPlaylists);

	      // If the active playlist is the one being deleted, reset the activePlaylist
	      if (activePlaylist && activePlaylist.id === playlistId) {
	        setActivePlaylist(null);
	      }

	      console.log('Playlist deleted successfully');
	    } catch (error) {
	      console.error('Failed to delete playlist:', error);
	    }
  	};

	async function handleAddPlaylist(e) {
        e.preventDefault();

      const formData = new FormData(e.target);
      const title = formData.get('playlist_title');
      const description = formData.get('playlist_description');
      const isPublic = formData.get('public');
      const userId = user.id;

		if (!title.trim()) {
			alert('Please enter a playlist title.');
			return;
		}

	    const token = window.localStorage.getItem('spotify_access_token');
	    if (!token) {
	        console.error('No access token available');
	        return;
	    }

	  // Define the request options
	  const requestOptions = {
	    method: 'POST',
	    headers: {
	      'Authorization': `Bearer ${token}`,
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify({
	      name: title,  // The title for the new playlist
	      description: description,
	      public: isPublic === 'on' ? true : false
	    })
	  };

	  try {
	    // Use the Spotify API endpoint to create a playlist
	    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, requestOptions);
	    if (!response.ok) {
	      throw new Error(`HTTP error! Status: ${response.status}`);
	    }
	    const data = await response.json();
	    console.log(data)
	    setActivePlaylist(data);
	    console.log('Playlist created successfully:', data);

	    // Return the playlist object or ID as needed
	    return data;
	  } catch (error) {
	    console.error('Failed to create playlist:', error);
	  }
	}

	const fetchPlaylistTracks = async (playlist) => {
		const tracksUrl = playlist.tracks.href;
	    const token = window.localStorage.getItem('spotify_access_token'); // Ensure you have the token
	    if (!token) {
	        console.error('No access token available');
	        return;
	    }

	    const response = await fetch(tracksUrl, {
	        headers: {
	            'Authorization': `Bearer ${token}`
	        }
	    });

	    if (!response.ok) {
	        throw new Error(`HTTP error! Status: ${response.status}`);
	    }

	    const data = await response.json();

		const getImageSrc = (images) => {
		  if (!images || images.length === 0) {
		    return ''; // Fallback URL or an empty string
		  } else if (images.length > 1) {
		    return images[1].url;
		  } else {
		    return images[0].url;
		  }
		};

	    const playlistObj = {
	    	id: playlist.id,
	    	name: playlist.name,
	    	tracks: data.items,
	    	thumbnail: getImageSrc(playlist.images),
	    	owner: playlist.owner.id
	    }

	    setActivePlaylist(playlistObj);
	};

	const onTrackReorder = (draggedTrackId, targetTrackId) => {
	    const updatedPlaylists = playlists.map(playlist => {
	        if (playlist === activePlaylist) {
	            const draggedTrackIndex = playlist.tracks.findIndex(t => t.id === draggedTrackId);
	            const targetTrackIndex = playlist.tracks.findIndex(t => t.id === targetTrackId);
	            const [removed] = playlist.tracks.splice(draggedTrackIndex, 1);
	            playlist.tracks.splice(targetTrackIndex, 0, removed);
	        }
	        return playlist;
	    });
	    setPlaylists(updatedPlaylists);
	    setActivePlaylist({ ...activePlaylist, tracks: updatedPlaylists.find(p => p === activePlaylist).tracks });
	};

	const showPlaylists = () => {
		if (user) {
			fetchUserPlaylists()
            .then(items => setPlaylists(items))
            .catch(error => console.error('Failed to fetch playlists:', error));
			setActiveConsole('playlists')
		}
	}

	useEffect(() => {
		const getUserData = async () => {
		  const userData = await fetchUser();
		  if (userData) {
		    console.log('Fetched User Data:', userData);
		    setUser(userData);
		  }
		};

		getUserData();
	}, []);

	useEffect(() => {
        fetchUserPlaylists()
            .then(items => setPlaylists(items))
            .catch(error => console.error('Failed to fetch playlists:', error));
    }, []);

    return (
        <>
            <div className={ user ? "grid-area" : "flex flex-col justify-center items-center h-dvh p-4"}>

            	{ user ? (
            	<>
            		<Nav user={user} />
	                <div className="flex flex-col gap-4 bg-gradient-to-br from-slate-950 to-slate-900 overflow-y-scroll border-white border-2 rounded-md pb-4">
	                    <div className="componentArea">
	                        {activePlaylist &&
	                        <Playlist
	                        	user = {user}
	                            playlist={activePlaylist}
	                            playlists={playlists}
	                            onUpdatePlaylistName={onUpdatePlaylistName}
	                            onDeleteTrack={handleDeleteTrack}
	                            onDeletePlaylist={handleDeletePlaylist}
	                            onTrackReorder={onTrackReorder} />}
	                    </div>
	                </div>

	                <div className="relative console bg-gradient-to-br from-slate-950 to-slate-900 overflow-y-scroll border-white border-2 rounded-md pb-4">
	                	<div className="bg-gradient-to-b from-70% from-slate-950/80 to-transparent sticky top-0 flex justify-between items-center gap-2 list-none py-4 px-4">
	                		<p className="font-bold">Quick View</p>
	                		<div className="flex gap-2">
		                    	<button className="bg-slate-900 rounded-md px-4 py-2 hover:bg-slate-800" onClick={showPlaylists}>Playlists</button>
								<button className="bg-slate-900 rounded-md px-4 py-2 hover:bg-slate-800" onClick={() => setActiveConsole('search')}>Search</button>
							</div>
						</div>
	                    {activeConsole === 'playlists' &&
	                    <PlaylistConsole
	                        playlists={playlists}
	                        onClickPlaylist={fetchPlaylistTracks}
	                        onAddPlaylist={handleAddPlaylist} />}
	                    {activeConsole === 'search' &&
	                    <SearchConsole
	                        onAddTrack={handleAddTrackToPlaylist} />}
	                </div>
                </>
            	) : (
            		<Nav user={user} />
            	)}
            </div>
        </>
    );
}

export default App;