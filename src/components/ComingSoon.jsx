import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ComingSoon({ icon, title, description, bullets = [] }) {
	return (
		<div className="flex flex-col gap-4 p-4 max-w-2xl">
			<div className="flex items-center gap-3">
				<FontAwesomeIcon icon={icon} className="text-emerald-400 text-2xl" />
				<h1 className="text-4xl font-bold">{title}</h1>
			</div>
			<p className="text-slate-400">{description}</p>

			{bullets.length > 0 && (
				<ul className="flex flex-col gap-2 border-2 border-white rounded-md p-4">
					{bullets.map((bullet) => (
						<li key={bullet} className="flex gap-2 items-start">
							<span className="text-emerald-400">-</span>
							<span>{bullet}</span>
						</li>
					))}
				</ul>
			)}

			<span className="w-fit text-xs uppercase tracking-wide text-slate-400 border border-slate-600 rounded-md px-2 py-1">
				Coming soon
			</span>
		</div>
	);
}

export default ComingSoon;
