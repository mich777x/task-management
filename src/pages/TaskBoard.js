import React, { useState, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, MoreVertical, Edit, Trash2, Filter, Search } from "lucide-react";
import { toast } from "react-toastify";

const TaskBoard = ({ tasks, onAddTask, onUpdateTask, onDeleteTask }) => {
	// State for modal, filters, and search
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentTask, setCurrentTask] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterPriority, setFilterPriority] = useState("all");
	const [view, setView] = useState("board");

	// Define column order
	const columnOrder = ["To Do", "In Progress", "Review", "Done"];

	// Task Modal Component
	const TaskModal = () => {
		const [formData, setFormData] = useState(
			currentTask
				? { ...currentTask }
				: {
						title: "",
						description: "",
						priority: "medium",
						dueDate: new Date().toISOString().split("T")[0],
						assignee: "",
						tags: [],
				  }
		);

		const handleSubmit = (e) => {
			e.preventDefault();

			if (currentTask) {
				// Update existing task
				onUpdateTask(currentTask.id, currentTask.status, formData);
				toast.success("Task updated successfully!");
			} else {
				// Add new task
				onAddTask(formData);
				toast.success("New task created!");
			}

			setIsModalOpen(false);
			setCurrentTask(null);
		};

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white rounded-lg p-6 w-full max-w-md">
					<h2 className="text-xl font-semibold mb-4">{currentTask ? "Edit Task" : "Create New Task"}</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
							<input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required placeholder="Enter task title" />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
							<textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3" placeholder="Task description" />
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
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
							<input type="text" value={formData.assignee} onChange={(e) => setFormData({ ...formData, assignee: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Assign to team member" />
						</div>
						<div className="flex justify-end space-x-3">
							<button
								type="button"
								onClick={() => {
									setIsModalOpen(false);
									setCurrentTask(null);
								}}
								className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
							>
								Cancel
							</button>
							<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
								{currentTask ? "Update Task" : "Create Task"}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	// Task Card Component
	const TaskCard = ({ task, index, columnId }) => {
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
				  ${snapshot.isDragging ? "ring-2 ring-blue-500" : ""}
				`}
					>
						<div className="flex justify-between items-start mb-2">
							<h3 className="font-medium text-gray-800">{task.title}</h3>
							<div className="flex space-x-2">
								<button
									onClick={() => {
										setCurrentTask({ ...task, status: columnId });
										setIsModalOpen(true);
									}}
									className="text-gray-500 hover:text-blue-600"
								>
									<Edit className="w-4 h-4" />
								</button>
								<button onClick={() => onDeleteTask(columnId, task.id)} className="text-gray-500 hover:text-red-600">
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>

						<div className="flex justify-between items-center text-sm text-gray-500">
							{/* Safely render priority */}
							<span
								className={`
					  px-2 py-1 rounded-full text-xs 
					  ${task.priority === "high" ? "bg-red-100 text-red-800" : task.priority === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}
					`}
							>
								{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
							</span>

							{/* Safely render assignee */}
							{task.assignee && <span className="text-xs">{task.assignee.name || "Unassigned"}</span>}
						</div>

						{/* Safely render project */}
						{task.project && <div className="text-xs text-gray-400 mt-2">Project: {task.project.name || "Unnamed Project"}</div>}

						{/* Render due date */}
						{task.dueDate && <div className="text-xs text-gray-400 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</div>}
					</div>
				)}
			</Draggable>
		);
	};
	// Column Component
	const Column = ({ column }) => {
		// Filter tasks based on search and priority
		const filteredTasks = tasks[column].filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()) && (filterPriority === "all" || task.priority === filterPriority));

		return (
			<Droppable droppableId={column}>
				{(provided, snapshot) => (
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						className={`bg-gray-100 rounded-lg p-4 min-h-[500px] ${snapshot.isDraggingOver ? "bg-blue-50" : ""}
            `}
					>
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-semibold text-gray-800">{column}</h2>
							<button
								onClick={() => {
									setCurrentTask({ status: column });
									setIsModalOpen(true);
								}}
								className="text-gray-500 hover:text-blue-600"
							>
								<Plus className="w-5 h-5" />
							</button>
						</div>
						{filteredTasks.map((task, index) => (
							<TaskCard key={task.id} task={task} index={index} columnId={column} />
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold text-gray-800">Task Board</h1>
				<button
					onClick={() => {
						setCurrentTask(null);
						setIsModalOpen(true);
					}}
					className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
				>
					<Plus className="mr-2 w-5 h-5" />
					Create Task
				</button>
			</div>

			{/* Filters and Controls */}
			<div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
				<div className="flex space-x-4">
					<div className="relative">
						<input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
						<Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
					</div>
					<select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
						<option value="all">All Priorities</option>
						<option value="high">High Priority</option>
						<option value="medium">Medium Priority</option>
						<option value="low">Low Priority</option>
					</select>
				</div>
				<div className="flex space-x-4">
					<button onClick={() => setView(view === "board" ? "timeline" : "board")} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
						{view === "board" ? "Timeline View" : "Board View"}
					</button>
				</div>
			</div>

			{/* Task Board or Timeline View */}
			{view === "board" ? (
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					{columnOrder.map((column) => (
						<Column key={column} column={column} />
					))}
				</div>
			) : (
				// Timeline View (simplified)
				<div className="bg-white rounded-lg shadow-md p-6">
					<h3 className="text-lg font-semibold mb-4">Timeline View</h3>
					{columnOrder.map((column) => (
						<div key={column} className="mb-6">
							<h4 className="text-md font-medium mb-3">{column}</h4>
							<div className="space-y-3">
								{tasks[column]
									.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()) && (filterPriority === "all" || task.priority === filterPriority))
									.map((task) => (
										<div key={task.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
											<div>
												<h5 className="font-medium">{task.title}</h5>
												<p className="text-sm text-gray-500">
													{task.assignee} | Due: {new Date(task.dueDate).toLocaleDateString()}
												</p>
											</div>
											<span className={`px-2 py-1 rounded-full text-xs ${task.priority === "high" ? "bg-red-100 text-red-800" : task.priority === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"} `}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
										</div>
									))}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Task Creation/Edit Modal */}
			{isModalOpen && <TaskModal />}
		</div>
	);
};

export default TaskBoard;
