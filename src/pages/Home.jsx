import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Nav from '../components/Nav.jsx';

function Home() {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex h-dvh w-dvw items-center justify-center">
				<p className="text-slate-400">Loading...</p>
			</div>
		);
	}

	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<div className="flex flex-col justify-center items-center h-dvh w-dvw p-4 gap-4">
			<Nav variant="landing" />
			<p className="text-slate-400 text-center max-w-sm">
				The Spotify cleanup &amp; management tool for everything the official app won&apos;t show you:
				artists you follow but never play, duplicate tracks, near-identical playlists, and playlists
				that quietly change without a trace.
			</p>
		</div>
	);
}

export default Home;
