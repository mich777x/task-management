import { useState, useEffect } from "react";

const INITIAL_TASKS = {
	"To Do": [
		{
			id: "1",
			title: "Research competitors",
			priority: "high",
			dueDate: "2024-12-01",
			assignee: "John Doe",
		},
	],
	"In Progress": [],
	Review: [],
	Done: [],
};

export const useTaskManagement = () => {
	const [tasks, setTasks] = useState(() => {
		try {
			const savedTasks = localStorage.getItem("tasks");
			return savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS;
		} catch (error) {
			console.error("Error loading tasks from localStorage:", error);
			return INITIAL_TASKS;
		}
	});

	useEffect(() => {
		try {
			// Only store the necessary task data
			const tasksToStore = Object.keys(tasks).reduce((acc, columnId) => {
				acc[columnId] = tasks[columnId].map((task) => ({
					id: task.id,
					title: task.title,
					priority: task.priority,
					dueDate: task.dueDate,
					assignee: task.assignee,
				}));
				return acc;
			}, {});

			localStorage.setItem("tasks", JSON.stringify(tasksToStore));
		} catch (error) {
			console.error("Error saving tasks to localStorage:", error);
		}
	}, [tasks]);

	const addTask = (task) => {
		if (!task?.title) return;

		const newTask = {
			...task,
			id: task.id || Date.now().toString(),
			priority: task.priority || "medium",
			dueDate: task.dueDate || new Date().toISOString().split("T")[0],
			assignee: task.assignee || "",
		};

		setTasks((prev) => ({
			...prev,
			"To Do": [...(prev["To Do"] || []), newTask],
		}));
	};
	const updateTask = (taskId, columnId, updatedTask) => {
		if (!taskId || !columnId || !updatedTask) return;

		const safeTask = {
			id: taskId,
			title: updatedTask.title,
			priority: updatedTask.priority,
			dueDate: updatedTask.dueDate,
			assignee: updatedTask.assignee,
		};

		setTasks((prev) => ({
			...prev,
			[columnId]: (prev[columnId] || []).map((task) => (task.id === taskId ? { ...task, ...safeTask } : task)),
		}));
	};

	const deleteTask = (columnId, taskId) => {
		if (!columnId || !taskId) return;

		setTasks((prev) => ({
			...prev,
			[columnId]: (prev[columnId] || []).filter((task) => task.id !== taskId),
		}));
	};

	const moveTask = (taskId, fromStatus, toStatus) => {
		if (!taskId || !fromStatus || !toStatus) return;

		setTasks((prev) => {
			const taskToMove = prev[fromStatus]?.find((task) => task.id === taskId);
			if (!taskToMove) return prev;

			const safeTask = {
				id: taskToMove.id,
				title: taskToMove.title,
				priority: taskToMove.priority,
				dueDate: taskToMove.dueDate,
				assignee: taskToMove.assignee,
			};

			return {
				...prev,
				[fromStatus]: prev[fromStatus].filter((task) => task.id !== taskId),
				[toStatus]: [...(prev[toStatus] || []), safeTask],
			};
		});
	};

	const handleDragEnd = (result) => {
		if (!result?.destination) return;

		const { source, destination } = result;

		setTasks((prev) => {
			const sourceColumn = [...(prev[source.droppableId] || [])];
			const destColumn = [...(prev[destination.droppableId] || [])];

			if (!sourceColumn || !destColumn) return prev;

			const [removed] = sourceColumn.splice(source.index, 1);
			const safeTask = {
				id: removed.id,
				title: removed.title,
				priority: removed.priority,
				dueDate: removed.dueDate,
				assignee: removed.assignee,
			};

			destColumn.splice(destination.index, 0, safeTask);

			return {
				...prev,
				[source.droppableId]: sourceColumn,
				[destination.droppableId]: destColumn,
			};
		});
	};

	return {
		tasks,
		addTask,
		updateTask,
		deleteTask,
		moveTask,
		handleDragEnd,
	};
};
