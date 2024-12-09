// App.jsx
import React, { useState } from "react";
import { Header } from "./components/Header";
import { Controls } from "./components/Controls";
import { Analytics } from "./components/Analytics";
import { TaskBoard } from "./components/TaskBoard";
import { Timeline } from "./components/Timeline";
import { TaskModal } from "./components/TaskModal";
import { useTaskManagement } from "./hooks/useTaskManagement";

const App = () => {
	const { tasks, addTask, updateTask, deleteTask, moveTask, handleDragEnd } = useTaskManagement();

	const [view, setView] = useState("board");
	const [isAnalyticsVisible, setIsAnalyticsVisible] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterPriority, setFilterPriority] = useState("all");
	const [selectedTask, setSelectedTask] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const filteredTasks = Object.keys(tasks).reduce((acc, columnId) => {
		acc[columnId] = (tasks[columnId] || []).filter((task) => {
			if (!task?.title) return false;

			const matchesSearch = searchTerm ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;

			const matchesPriority = filterPriority === "all" || task.priority === filterPriority;

			return matchesSearch && matchesPriority;
		});
		return acc;
	}, {});

	const handleTaskSave = (task) => {
		if (!task?.title) return;

		const safeTask = {
			id: task.id,
			title: task.title,
			priority: task.priority || "medium",
			dueDate: task.dueDate || new Date().toISOString().split("T")[0],
			assignee: task.assignee || "",
		};

		if (task.id) {
			const columnId = Object.keys(tasks).find((key) => tasks[key]?.some((t) => t.id === task.id)) || "To Do";
			updateTask(task.id, columnId, safeTask);
		} else {
			addTask(safeTask);
		}
		setIsModalOpen(false);
		setSelectedTask(null);
	};

	const handleAddNewTask = () => {
		const newTask = {
			title: "",
			priority: "medium",
			dueDate: new Date().toISOString().split("T")[0],
			assignee: "",
		};
		setSelectedTask(newTask);
		setIsModalOpen(true);
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<Header />

			<main className="p-6">
				<Controls searchTerm={searchTerm} onSearchChange={setSearchTerm} filterPriority={filterPriority} onFilterChange={setFilterPriority} onAddClick={handleAddNewTask} isAnalyticsVisible={isAnalyticsVisible} onToggleAnalytics={() => setIsAnalyticsVisible(!isAnalyticsVisible)} view={view} onViewChange={setView} />

				{isAnalyticsVisible && <Analytics tasks={tasks} />}

				{view === "board" ? (
					<TaskBoard
						tasks={filteredTasks}
						onDragEnd={handleDragEnd}
						onTaskClick={(task) => {
							if (task?.id) {
								setSelectedTask({
									id: task.id,
									title: task.title,
									priority: task.priority,
									dueDate: task.dueDate,
									assignee: task.assignee,
								});
								setIsModalOpen(true);
							}
						}}
						onDeleteTask={deleteTask}
					/>
				) : (
					<Timeline tasks={filteredTasks} />
				)}

				{isModalOpen && selectedTask && (
					<TaskModal
						task={selectedTask}
						onClose={() => {
							setIsModalOpen(false);
							setSelectedTask(null);
						}}
						onSave={handleTaskSave}
						onChange={setSelectedTask}
						statuses={Object.keys(tasks)}
						currentStatus={selectedTask.id ? Object.keys(tasks).find((key) => tasks[key]?.some((task) => task.id === selectedTask.id)) || "To Do" : "To Do"}
						onStatusChange={(newStatus) => {
							if (selectedTask.id) {
								const currentStatus = Object.keys(tasks).find((key) => tasks[key]?.some((task) => task.id === selectedTask.id)) || "To Do";
								moveTask(selectedTask.id, currentStatus, newStatus);
								setIsModalOpen(false);
								setSelectedTask(null);
							}
						}}
					/>
				)}
			</main>
		</div>
	);
};

export default App;
