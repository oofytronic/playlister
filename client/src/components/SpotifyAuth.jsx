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
        window.localStorage.setItem('spotify_access_token', '');
        const client_id = 'e65e3c5df0184e0f9d104b88da16b5fd';
        const redirect_uri = encodeURIComponent('https://bridgebeat.app');
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
