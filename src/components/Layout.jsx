import { Outlet } from 'react-router-dom';
import Nav from './Nav.jsx';

function Layout() {
	return (
		<div className="flex h-dvh w-dvw gap-4 p-4">
			<Nav />
			<main className="flex-1 flex flex-col gap-4 bg-gradient-to-br from-slate-950 to-slate-900 border-white border-2 rounded-md overflow-y-auto">
				<Outlet />
			</main>
		</div>
	);
}

export default Layout;
