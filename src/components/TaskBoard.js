import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { TaskColumn } from "./TaskColumn";

export const TaskBoard = ({ tasks, onDragEnd, onTaskClick, onDeleteTask }) => {
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{Object.entries(tasks).map(([columnId, columnTasks]) => (
					<div key={columnId} className="bg-gray-50 rounded-lg p-4">
						<h2 className="text-lg font-semibold mb-4">{columnId}</h2>
						<TaskColumn columnId={columnId} tasks={columnTasks} onTaskClick={onTaskClick} onDeleteTask={onDeleteTask} />
					</div>
				))}
			</div>
		</DragDropContext>
	);
};
