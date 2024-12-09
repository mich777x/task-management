export const TimelineItem = ({ task }) => {
	const priorityColors = {
		high: "bg-red-500",
		medium: "bg-yellow-500",
		low: "bg-green-500",
	};

	return (
		<div className="flex items-center space-x-4">
			<div className="w-24 text-sm text-gray-500">{task.dueDate}</div>
			<div className="flex-1">
				<div className="h-2 w-full bg-gray-100 rounded">
					<div className={`h-full rounded ${priorityColors[task.priority]}`} style={{ width: "50%" }} />
				</div>
			</div>
			<div className="w-32 text-sm">{task.title}</div>
		</div>
	);
};
