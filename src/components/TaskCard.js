import { Trash2 } from "lucide-react";
import { TaskDetails } from "./TaskDetails";
import { Draggable } from "react-beautiful-dnd";

export const TaskCard = ({ task, index, columnId, onClick, onDelete }) => {
	return (
		<Draggable draggableId={task.id} index={index}>
			{(provided) => (
				<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow" onClick={onClick}>
					<div className="flex justify-between items-start mb-2">
						<h3 className="font-medium">{task.title}</h3>
						<button
							onClick={(e) => {
								e.stopPropagation();
								onDelete();
							}}
						>
							<Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
						</button>
					</div>
					<TaskDetails task={task} />
				</div>
			)}
		</Draggable>
	);
};
