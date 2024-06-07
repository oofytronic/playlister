import { useEffect } from 'react';

const SpotifyAuth = () => {
  async function refreshAccessToken() {
    const refresh_token = localStorage.getItem('spotify_refresh_token');
    if (!refresh_token) {
      // Redirect to home page if refresh token is not available
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
      return;
    }

    try {
      const response = await fetch('http://204.48.24.192/refresh_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token }),
      });
      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('spotify_access_token', data.access_token);
        return data.access_token;
      } else {
        // Redirect to home page if unable to refresh token
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      // Redirect to home page in case of an error
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
  }

  const handleLogin = () => {
    window.location.href = 'http://204.48.24.192/login';
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      if (access_token) {
        localStorage.setItem('spotify_access_token', access_token);
        localStorage.setItem('spotify_refresh_token', refresh_token);
        window.location.hash = '';
      }
    }
  }, []);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      let access_token = localStorage.getItem('spotify_access_token');
      if (!access_token) {
        access_token = await refreshAccessToken();
      }
    };

    checkAndRefreshToken();

    const interval = setInterval(async () => {
      console.log('Refreshing token...');
      await refreshAccessToken();
    }, 3300000); // 55 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <button className="bg-slate-900 text-white border-emerald-400 border-2 rounded-md hover:bg-emerald-400 px-4 py-2" onClick={handleLogin}>Log in with Spotify</button>
  );
};

export default SpotifyAuth;
