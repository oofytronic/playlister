import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Callback from './pages/Callback.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Playlists from './pages/Playlists.jsx';
import Backups from './pages/Backups.jsx';
import GhostFollows from './pages/GhostFollows.jsx';
import Duplicates from './pages/Duplicates.jsx';
import OverlapFinder from './pages/OverlapFinder.jsx';
import BulkActions from './pages/BulkActions.jsx';
import Timeline from './pages/Timeline.jsx';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/callback" element={<Callback />} />

			<Route element={<ProtectedRoute />}>
				<Route element={<Layout />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/playlists" element={<Playlists />} />
					<Route path="/backups" element={<Backups />} />
					<Route path="/ghost-follows" element={<GhostFollows />} />
					<Route path="/duplicates" element={<Duplicates />} />
					<Route path="/overlap-finder" element={<OverlapFinder />} />
					<Route path="/bulk-actions" element={<BulkActions />} />
					<Route path="/timeline" element={<Timeline />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
