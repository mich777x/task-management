import React from "react";
import { TimelineItem } from "./TimelineItem";

export const Timeline = ({ tasks }) => {
	const allTasks = Object.values(tasks)
		.flat()
		.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

	return (
		<div className="bg-white p-4 rounded-lg shadow-sm mb-6">
			<h3 className="text-lg font-semibold mb-4">Timeline</h3>
			<div className="space-y-4">
				{allTasks.map((task) => (
					<TimelineItem key={task.id} task={task} />
				))}
			</div>
		</div>
	);
};
