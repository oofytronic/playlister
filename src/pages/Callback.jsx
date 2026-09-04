import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleAuthCallback } from '../lib/spotifyAuth.js';
import { useAuth } from '../context/AuthContext.jsx';

function Callback() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { refreshUser } = useAuth();
	const [error, setError] = useState(null);

	useEffect(() => {
		let cancelled = false;

		handleAuthCallback(searchParams)
			.then(async () => {
				if (cancelled) return;
				await refreshUser();
				navigate('/dashboard', { replace: true });
			})
			.catch((err) => {
				if (cancelled) return;
				console.error(err);
				setError(err.message);
			});

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex h-dvh w-dvw items-center justify-center p-4">
			{error ? (
				<div className="flex flex-col items-center gap-4 text-center">
					<p className="text-red-400">{error}</p>
					<a className="border-2 border-white rounded-md hover:bg-white hover:text-slate-950 px-4 py-2" href="/">
						Back to login
					</a>
				</div>
			) : (
				<p className="text-slate-400">Connecting to Spotify...</p>
			)}
		</div>
	);
}

export default Callback;
