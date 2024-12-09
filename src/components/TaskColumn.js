import { TaskCard } from "./TaskCard";
import { Droppable } from "react-beautiful-dnd";

export const TaskColumn = ({ columnId, tasks, onTaskClick, onDeleteTask }) => {
	return (
		<Droppable droppableId={columnId}>
			{(provided) => (
				<div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
					{tasks.map((task, index) => (
						<TaskCard key={task.id} task={task} index={index} columnId={columnId} onClick={() => onTaskClick(task)} onDelete={() => onDeleteTask(columnId, task.id)} />
					))}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
};
