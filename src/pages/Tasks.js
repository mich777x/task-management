import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useTaskContext } from "../context/TaskContext";
import { toast } from "react-toastify";

const Tasks = () => {
	const { tasks, addTask, updateTask, deleteTask, projects, team } = useTaskContext();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentTask, setCurrentTask] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterPriority, setFilterPriority] = useState("all");

	// Handle drag end
	const onDragEnd = (result) => {
		const { source, destination } = result;

		// Dropped outside any droppable area
		if (!destination) return;

		// Dropped in the same position
		if (source.droppableId === destination.droppableId && source.index === destination.index) return;

		// Get source and destination columns
		const sourceColumn = tasks[source.droppableId];
		const destColumn = tasks[destination.droppableId];

		// Get the dragged task
		const task = sourceColumn[source.index];

		// Create new arrays for the columns
		const newSourceColumn = Array.from(sourceColumn);
		const newDestColumn = source.droppableId === destination.droppableId ? newSourceColumn : Array.from(destColumn);

		// Remove task from source column
		newSourceColumn.splice(source.index, 1);

		// Add task to destination column
		if (source.droppableId === destination.droppableId) {
			newSourceColumn.splice(destination.index, 0, task);
		} else {
			newDestColumn.splice(destination.index, 0, {
				...task,
				status: destination.droppableId,
			});
		}

		// Update the task's status
		updateTask(task.id, source.droppableId, {
			...task,
			status: destination.droppableId,
		});

		// Update state (this should trigger a re-render)
		const newTasks = {
			...tasks,
			[source.droppableId]: newSourceColumn,
		};

		if (source.droppableId !== destination.droppableId) {
			newTasks[destination.droppableId] = newDestColumn;
		}
	};

	// Task Card Component
	const TaskCard = ({ task, index }) => {
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

		const getAssignedUser = (userId) => {
			return team.find((member) => member.id === userId)?.name || "Unassigned";
		};

		const getProject = (projectId) => {
			return projects.find((project) => project.id === projectId)?.name || "";
		};

		return (
			<Draggable draggableId={task.id} index={index}>
				{(provided, snapshot) => (
					<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`bg-white rounded-md shadow-sm p-4 mb-3 ${getPriorityColor(task.priority)} ${snapshot.isDragging ? "ring-2 ring-blue-500" : ""} hover:shadow-md transition-all duration-200`}>
						<div className="flex justify-between items-start mb-2">
							<h3 className="font-medium text-gray-900">{task.title}</h3>
							<div className="flex space-x-2">
								<button
									onClick={() => {
										setCurrentTask(task);
										setIsModalOpen(true);
									}}
									className="text-gray-500 hover:text-blue-600"
								>
									<Edit className="w-4 h-4" />
								</button>
								<button
									onClick={() => {
										if (window.confirm("Are you sure you want to delete this task?")) {
											deleteTask(task.status, task.id);
											toast.success("Task deleted successfully");
										}
									}}
									className="text-gray-500 hover:text-red-600"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>

						{task.description && <p className="text-sm text-gray-600 mb-2">{task.description}</p>}

						{task.projectId && <div className="text-xs text-gray-500 mb-2">Project: {getProject(task.projectId)}</div>}

						<div className="flex items-center justify-between text-sm">
							<span className={`px-2 py-1 rounded-full text-xs font-medium ${task.priority === "high" ? "bg-red-100 text-red-800" : task.priority === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>

							<span className="text-gray-500 text-xs">{getAssignedUser(task.assignedTo)}</span>
						</div>

						{task.dueDate && <div className="mt-2 text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</div>}
					</div>
				)}
			</Draggable>
		);
	};

	// Task Modal Component
	const TaskModal = ({ onClose }) => {
		const [formData, setFormData] = useState(
			currentTask || {
				title: "",
				description: "",
				priority: "medium",
				status: "To Do",
				dueDate: new Date().toISOString().split("T")[0],
				projectId: "",
				assignedTo: "",
			}
		);

		const handleSubmit = (e) => {
			e.preventDefault();

			try {
				if (currentTask && currentTask.id) {
					updateTask(currentTask.id, currentTask.status || "To Do", formData);
					toast.success("Task updated successfully");
				} else {
					addTask(formData);
					toast.success("Task created successfully");
				}
				onClose();
			} catch (error) {
				console.error("Error handling task:", error);
				toast.error("Error saving task");
			}
		};

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white rounded-lg p-6 w-full max-w-md">
					<h2 className="text-xl font-semibold mb-4">{currentTask?.id ? "Edit Task" : "Create New Task"}</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
							<input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
							<textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3" />
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
							<select value={formData.projectId} onChange={(e) => setFormData({ ...formData, projectId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
								<option value="">Select Project</option>
								{projects.map((project) => (
									<option key={project.id} value={project.id}>
										{project.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
							<select value={formData.assignedTo} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
								<option value="">Select Team Member</option>
								{team.map((member) => (
									<option key={member.id} value={member.id}>
										{member.name}
									</option>
								))}
							</select>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
								<select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
								<input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
							</div>
						</div>

						<div className="flex justify-end space-x-3">
							<button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
								Cancel
							</button>
							<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
								{currentTask?.id ? "Update" : "Create"}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	// Column Component
	const Column = ({ title, tasks: columnTasks }) => {
		const filteredTasks = columnTasks.filter((task) => {
			const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
			return matchesSearch && matchesPriority;
		});

		return (
			<div className="bg-gray-100 rounded-lg p-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold text-gray-800">{title}</h2>
					<div className="flex items-center space-x-2">
						<span className="text-sm text-gray-500">{filteredTasks.length}</span>
						<button
							onClick={() => {
								setCurrentTask({ status: title });
								setIsModalOpen(true);
							}}
							className="text-gray-500 hover:text-blue-600"
						>
							<Plus className="w-5 h-5" />
						</button>
					</div>
				</div>
				<Droppable droppableId={title}>
					{(provided, snapshot) => (
						<div {...provided.droppableProps} ref={provided.innerRef} className={`min-h-[200px] ${snapshot.isDraggingOver ? "bg-blue-50" : ""}`}>
							{filteredTasks.map((task, index) => (
								<TaskCard key={task.id} task={task} index={index} />
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</div>
		);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="space-y-6">
				{/* Header and Filters */}
				<div className="flex flex-col sm:flex-row justify-between gap-4">
					<div className="flex space-x-4">
						<button
							onClick={() => {
								setCurrentTask(null);
								setIsModalOpen(true);
							}}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700"
						>
							<Plus className="w-5 h-5 mr-2" />
							Create Task
						</button>
						<div className="relative">
							<input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
							<Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
						</div>
					</div>
					<select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
						<option value="all">All Priorities</option>
						<option value="high">High Priority</option>
						<option value="medium">Medium Priority</option>
						<option value="low">Low Priority</option>
					</select>
				</div>

				{/* Task Board */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					{Object.entries(tasks).map(([columnId, columnTasks]) => (
						<Column key={columnId} title={columnId} tasks={columnTasks} />
					))}
				</div>

				{/* Task Modal */}
				{isModalOpen && (
					<TaskModal
						onClose={() => {
							setIsModalOpen(false);
							setCurrentTask(null);
						}}
					/>
				)}
			</div>
		</DragDropContext>
	);
};

export default Tasks;
