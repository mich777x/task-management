import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTaskContext } from "../context/TaskContext";
import { Plus, Search, Edit, Trash2, Clock } from "lucide-react";

const Tasks = () => {
	const { tasks, team, addTask, updateTask, deleteTask, handleDragEnd } = useTaskContext();
	const [searchTerm, setSearchTerm] = useState("");
	const [filterPriority, setFilterPriority] = useState("all");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentTask, setCurrentTask] = useState(null);
	const [selectedColumn, setSelectedColumn] = useState(null);

	// Column order
	const columnOrder = ["To Do", "In Progress", "Review", "Done"];

	// Get priority color for task cards
	const getPriorityColor = (priority) => {
		switch (priority) {
			case "high":
				return "border-l-4 border-red-500";
			case "medium":
				return "border-l-4 border-yellow-500";
			case "low":
				return "border-l-4 border-green-500";
			default:
				return "border-l-4 border-gray-300";
		}
	};

	// TaskModal Component
	const TaskModal = () => {
		const [formData, setFormData] = useState(
			currentTask || {
				title: "",
				description: "",
				priority: "medium",
				dueDate: new Date().toISOString().split("T")[0],
				assignee: "",
				status: selectedColumn || "To Do",
			}
		);

		const handleSubmit = (e) => {
			e.preventDefault();

			if (currentTask) {
				// Update existing task
				updateTask(currentTask.id, currentTask.status, {
					...formData,
					status: currentTask.status,
				});
			} else {
				// Create new task
				addTask(
					{
						...formData,
						status: selectedColumn,
					},
					selectedColumn
				);
			}

			setIsModalOpen(false);
			setCurrentTask(null);
			setSelectedColumn(null);
		};

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white rounded-xl p-6 w-full max-w-md">
					<h2 className="text-xl font-semibold mb-4">{currentTask ? "Edit Task" : `Create Task in ${selectedColumn}`}</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
							<input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
							<textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="3" />
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
								<select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
								<input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
							<select value={formData.assignee} onChange={(e) => setFormData({ ...formData, assignee: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="">Unassigned</option>
								{team.map((member) => (
									<option key={member.id} value={member.id}>
										{member.name}
									</option>
								))}
							</select>
						</div>

						<div className="flex justify-end space-x-3 pt-4">
							<button
								type="button"
								onClick={() => {
									setIsModalOpen(false);
									setCurrentTask(null);
									setSelectedColumn(null);
								}}
								className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
							>
								Cancel
							</button>
							<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
								{currentTask ? "Update Task" : "Create Task"}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	// TaskCard Component
	const TaskCard = ({ task, index, columnId }) => {
		return (
			<Draggable draggableId={task.id} index={index}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						className={`
              bg-white rounded-md shadow-sm p-4 mb-3 
              ${getPriorityColor(task.priority)}
              ${snapshot.isDragging ? "shadow-lg ring-2 ring-blue-500" : ""}
              hover:shadow-md transition-shadow
              cursor-grab active:cursor-grabbing
            `}
					>
						<div className="flex justify-between items-start">
							<h3 className="font-medium text-gray-800">{task.title}</h3>
							<div className="flex space-x-2">
								<button
									onClick={(e) => {
										e.stopPropagation();
										setCurrentTask({ ...task, status: columnId });
										setSelectedColumn(columnId);
										setIsModalOpen(true);
									}}
									className="text-gray-500 hover:text-blue-600"
								>
									<Edit className="w-4 h-4" />
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										deleteTask(columnId, task.id);
									}}
									className="text-gray-500 hover:text-red-600"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>

						{task.description && <p className="text-sm text-gray-500 mt-2">{task.description}</p>}

						<div className="flex items-center justify-between mt-4 text-sm">
							<div className="flex items-center text-gray-500">
								<Clock className="w-4 h-4 mr-1" />
								<span>{new Date(task.dueDate).toLocaleDateString()}</span>
							</div>
							{task.assignee && (
								<div className="flex items-center">
									<div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
										<span className="text-xs font-medium">{team.find((m) => m.id === task.assignee)?.name?.charAt(0)}</span>
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</Draggable>
		);
	};

	// Column Component
	const Column = ({ column }) => {
		const filteredTasks = (tasks[column] || []).filter((task) => {
			const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
			return matchesSearch && matchesPriority;
		});

		return (
			<Droppable droppableId={column}>
				{(provided, snapshot) => (
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						className={`
              bg-gray-100 rounded-lg p-4 min-h-[500px]
              ${snapshot.isDraggingOver ? "bg-blue-50 ring-2 ring-blue-200" : ""}
            `}
					>
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-semibold text-gray-800">
								{column}
								{filteredTasks.length > 0 && <span className="ml-2 text-sm text-gray-500">({filteredTasks.length})</span>}
							</h2>
							<button
								onClick={() => {
									setCurrentTask(null);
									setSelectedColumn(column);
									setIsModalOpen(true);
								}}
								className="text-gray-500 hover:text-blue-600"
							>
								<Plus className="w-5 h-5" />
							</button>
						</div>

						<div className="space-y-2">
							{filteredTasks.map((task, index) => (
								<TaskCard key={task.id} task={task} index={index} columnId={column} />
							))}
						</div>
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		);
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
					<div className="flex items-center space-x-4">
						<button
							onClick={() => {
								setCurrentTask(null);
								setSelectedColumn("To Do");
								setIsModalOpen(true);
							}}
							className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
						>
							<Plus className="w-5 h-5 mr-2" />
							Add Task
						</button>
						<div className="relative">
							<input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64" />
							<Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
						</div>
					</div>

					<select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
						<option value="all">All Priorities</option>
						<option value="high">High Priority</option>
						<option value="medium">Medium Priority</option>
						<option value="low">Low Priority</option>
					</select>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{columnOrder.map((column) => (
						<Column key={column} column={column} />
					))}
				</div>

				{isModalOpen && <TaskModal />}
			</div>
		</DragDropContext>
	);
};

export default Tasks;
