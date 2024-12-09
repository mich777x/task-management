import { Calendar, Tag } from "lucide-react";

export const TaskDetails = ({ task }) => {
	const priorityClasses = {
		high: "bg-red-100 text-red-800",
		medium: "bg-yellow-100 text-yellow-800",
		low: "bg-green-100 text-green-800",
	};

	return (
		<div className="flex items-center space-x-4 text-sm text-gray-500">
			<div className="flex items-center">
				<Calendar className="w-4 h-4 mr-1" />
				{task.dueDate}
			</div>
			<div className="flex items-center">
				<Tag className="w-4 h-4 mr-1" />
				<span className={`px-2 py-1 rounded-full text-xs ${priorityClasses[task.priority]}`}>{task.priority}</span>
			</div>
		</div>
	);
};
