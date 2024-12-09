export const MetricCard = ({ title, value, Icon, color }) => {
	const colorClasses = {
		blue: "text-blue-500",
		green: "text-green-500",
		red: "text-red-500",
		yellow: "text-yellow-500",
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-sm">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-gray-500">{title}</p>
					<p className="text-2xl font-semibold">{value}</p>
				</div>
				<Icon className={`w-8 h-8 ${colorClasses[color]}`} />
			</div>
		</div>
	);
};
