import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const useTaskManager = () => {
	// Initialize tasks from localStorage or with default structure
	const [tasks, setTasks] = useState(() => {
		const savedTasks = localStorage.getItem("tasks");
		return savedTasks
			? JSON.parse(savedTasks)
			: {
					"To Do": [],
					"In Progress": [],
					Review: [],
					Done: [],
			  };
	});

	// Initialize projects from localStorage
	const [projects, setProjects] = useState(() => {
		const savedProjects = localStorage.getItem("projects");
		return savedProjects ? JSON.parse(savedProjects) : [];
	});

	// Initialize team from localStorage
	const [team, setTeam] = useState(() => {
		const savedTeam = localStorage.getItem("team");
		return savedTeam ? JSON.parse(savedTeam) : [];
	});

	// Initialize events from localStorage
	const [events, setEvents] = useState(() => {
		const savedEvents = localStorage.getItem("events");
		return savedEvents ? JSON.parse(savedEvents) : [];
	});

	// Save tasks to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}, [tasks]);

	useEffect(() => {
		localStorage.setItem("projects", JSON.stringify(projects));
	}, [projects]);

	useEffect(() => {
		localStorage.setItem("team", JSON.stringify(team));
	}, [team]);

	useEffect(() => {
		localStorage.setItem("events", JSON.stringify(events));
	}, [events]);

	// Add a new task
	const addTask = (taskData, column = "To Do") => {
		const newTask = {
			id: uuidv4(),
			title: taskData.title,
			description: taskData.description || "",
			priority: taskData.priority || "medium",
			dueDate: taskData.dueDate || new Date().toISOString().split("T")[0],
			assignee: taskData.assignee || null,
			status: taskData.status || column,
			createdAt: new Date().toISOString(),
			projectId: taskData.projectId || null,
			tags: taskData.tags || [],
		};

		setTasks((prevTasks) => {
			const updatedTasks = { ...prevTasks };
			updatedTasks[column] = [...(updatedTasks[column] || []), newTask];
			return updatedTasks;
		});

		return newTask;
	};

	// Update an existing task
	const updateTask = (taskId, columnId, updatedData) => {
		setTasks((prevTasks) => {
			const updatedTasks = { ...prevTasks };
			const column = updatedTasks[columnId];
			const taskIndex = column.findIndex((task) => task.id === taskId);

			if (taskIndex === -1) return prevTasks;

			if (updatedData.status && updatedData.status !== columnId) {
				// Task is moving to a new column
				const [movedTask] = column.splice(taskIndex, 1);
				const updatedTask = {
					...movedTask,
					...updatedData,
					updatedAt: new Date().toISOString(),
				};
				updatedTasks[updatedData.status] = [...(updatedTasks[updatedData.status] || []), updatedTask];
			} else {
				// Task is being updated in the same column
				column[taskIndex] = {
					...column[taskIndex],
					...updatedData,
					updatedAt: new Date().toISOString(),
				};
			}

			return updatedTasks;
		});
	};

	// Delete a task
	const deleteTask = (columnId, taskId) => {
		setTasks((prevTasks) => {
			const updatedTasks = { ...prevTasks };
			updatedTasks[columnId] = updatedTasks[columnId].filter((task) => task.id !== taskId);
			return updatedTasks;
		});
	};

	// Handle drag and drop
	const handleDragEnd = (result) => {
		const { source, destination, draggableId } = result;

		// Return if dropped outside or in same position
		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index) {
			return;
		}

		setTasks((prevTasks) => {
			// Create copies of the source and destination columns
			const sourceCol = Array.from(prevTasks[source.droppableId]);
			const destCol = source.droppableId === destination.droppableId ? sourceCol : Array.from(prevTasks[destination.droppableId] || []);

			// Find and remove the task from the source column
			const [movedTask] = sourceCol.splice(source.index, 1);

			// Update the task's status and add to destination
			const updatedTask = {
				...movedTask,
				status: destination.droppableId,
				updatedAt: new Date().toISOString(),
			};

			// Insert the task at the new position
			if (source.droppableId === destination.droppableId) {
				sourceCol.splice(destination.index, 0, updatedTask);
			} else {
				destCol.splice(destination.index, 0, updatedTask);
			}

			// Return the updated tasks state
			return {
				...prevTasks,
				[source.droppableId]: sourceCol,
				[destination.droppableId]: source.droppableId === destination.droppableId ? sourceCol : destCol,
			};
		});
	};

	// Project management functions
	const addProject = (projectData) => {
		const newProject = {
			id: uuidv4(),
			...projectData,
			createdAt: new Date().toISOString(),
		};
		setProjects((prevProjects) => [...prevProjects, newProject]);
		return newProject;
	};

	const updateProject = (projectId, updatedData) => {
		setProjects((prevProjects) => prevProjects.map((project) => (project.id === projectId ? { ...project, ...updatedData, updatedAt: new Date().toISOString() } : project)));
	};

	const deleteProject = (projectId) => {
		setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
	};

	// Team management functions
	const addTeamMember = (memberData) => {
		const newMember = {
			id: uuidv4(),
			...memberData,
			createdAt: new Date().toISOString(),
		};
		setTeam((prevTeam) => [...prevTeam, newMember]);
		return newMember;
	};

	const updateTeamMember = (memberId, updatedData) => {
		setTeam((prevTeam) => prevTeam.map((member) => (member.id === memberId ? { ...member, ...updatedData, updatedAt: new Date().toISOString() } : member)));
	};

	const deleteTeamMember = (memberId) => {
		setTeam((prevTeam) => prevTeam.filter((member) => member.id !== memberId));
	};

	// Event management functions
	const addEvent = (eventData) => {
		const newEvent = {
			id: uuidv4(),
			...eventData,
			createdAt: new Date().toISOString(),
		};
		setEvents((prevEvents) => [...prevEvents, newEvent]);
		return newEvent;
	};

	const updateEvent = (eventId, updatedData) => {
		setEvents((prevEvents) => prevEvents.map((event) => (event.id === eventId ? { ...event, ...updatedData, updatedAt: new Date().toISOString() } : event)));
	};

	const deleteEvent = (eventId) => {
		setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
	};

	return {
		tasks,
		projects,
		team,
		events,
		addTask,
		updateTask,
		deleteTask,
		handleDragEnd,
		addProject,
		updateProject,
		deleteProject,
		addTeamMember,
		updateTeamMember,
		deleteTeamMember,
		addEvent,
		updateEvent,
		deleteEvent,
	};
};

export default useTaskManager;
