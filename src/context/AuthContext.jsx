import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { isLoggedIn, login as loginRedirect, logout as clearSession, getValidAccessToken } from '../lib/spotifyAuth.js';
import { spotifyFetch } from '../lib/spotifyClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'anonymous'

	const loadUser = useCallback(async () => {
		if (!isLoggedIn()) {
			setUser(null);
			setStatus('anonymous');
			return;
		}

		try {
			const token = await getValidAccessToken();
			if (!token) {
				setUser(null);
				setStatus('anonymous');
				return;
			}
			const me = await spotifyFetch('/me');
			setUser(me);
			setStatus('authenticated');
		} catch (error) {
			console.error('Failed to load Spotify profile:', error);
			setUser(null);
			setStatus('anonymous');
		}
	}, []);

	useEffect(() => {
		loadUser();
	}, [loadUser]);

	const login = useCallback(() => loginRedirect(), []);

	const logout = useCallback(() => {
		setUser(null);
		setStatus('anonymous');
		clearSession();
	}, []);

	const value = {
		user,
		status,
		isAuthenticated: status === 'authenticated',
		isLoading: status === 'loading',
		login,
		logout,
		refreshUser: loadUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return ctx;
}
