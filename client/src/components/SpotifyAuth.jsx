import { useEffect } from 'react';

const SpotifyAuth = () => {
    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem('spotify_access_token');

        if (!token && hash) {
            token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
            window.location.hash = ''; // Clear hash in URL
            window.localStorage.setItem('spotify_access_token', token);
        }

        if (token) {
            if (token !== window.localStorage.getItem('spotify_access_token')) {
               window.localStorage.setItem('spotify_access_token', token); 
            } else {
                console.log('Already logged in')
            }
        }

        const error = new URLSearchParams(window.location.hash).get('error');
        if (error) {
            console.error('Error during authentication:', error);
            // Handle errors here, such as showing a message to the user
        }
    }, []);

    const handleLogin = () => {
        const client_id = '899a0e6b070d4b6eae06711c13eddd13';
        const redirect_uri = encodeURIComponent('http://localhost:5173');
        const scopes = encodeURIComponent('ugc-image-upload playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-library-modify user-library-read user-read-email user-read-private'); // Scopes limit access for OAuth tokens
        const responseType = 'token';

        const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes}&response_type=${responseType}&show_dialog=true`;
        window.location = authUrl;
    };

    return (
        <button className="bg-slate-900 text-white border-emerald-400 border-2 rounded-md hover:bg-emerald-400 px-4 py-2" onClick={handleLogin}>Log in with Spotify</button>
    );
};

export default SpotifyAuth;
