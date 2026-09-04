import { useAuth } from '../context/AuthContext.jsx';

function SpotifyLoginButton() {
	const { login } = useAuth();

	return (
		<button
			className="bg-slate-900 text-white border-emerald-400 border-2 rounded-md hover:bg-emerald-400 hover:text-slate-950 px-4 py-2"
			onClick={login}
		>
			Log in with Spotify
		</button>
	);
}

export default SpotifyLoginButton;
