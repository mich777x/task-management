import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
	// Initialize tasks state
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

	// Initialize projects state
	const [projects, setProjects] = useState(() => {
		const savedProjects = localStorage.getItem("projects");
		return savedProjects ? JSON.parse(savedProjects) : [];
	});

	// Initialize team state
	const [team, setTeam] = useState(() => {
		const savedTeam = localStorage.getItem("team");
		return savedTeam ? JSON.parse(savedTeam) : [];
	});

	// Initialize events state
	const [events, setEvents] = useState(() => {
		const savedEvents = localStorage.getItem("events");
		return savedEvents ? JSON.parse(savedEvents) : [];
	});

	// Save to localStorage whenever data changes
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

	// Task management functions
	const addTask = (taskData, column = "To Do") => {
		const newTask = {
			id: uuidv4(),
			title: taskData.title,
			description: taskData.description || "",
			priority: taskData.priority || "medium",
			status: column,
			dueDate: taskData.dueDate || new Date().toISOString().split("T")[0],
			assignedTo: taskData.assignedTo || null,
			projectId: taskData.projectId || null,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			tags: taskData.tags || [],
			comments: [],
			attachments: [],
		};

		setTasks((prev) => ({
			...prev,
			[column]: [...prev[column], newTask],
		}));

		return newTask;
	};

	const updateTask = (taskId, columnId, updatedData) => {
		setTasks((prev) => {
			const newTasks = { ...prev };
			const column = newTasks[columnId];
			const taskIndex = column.findIndex((task) => task.id === taskId);

			if (taskIndex === -1) return prev;

			if (updatedData.status && updatedData.status !== columnId) {
				// Move task to different column
				const [movedTask] = column.splice(taskIndex, 1);
				const updatedTask = {
					...movedTask,
					...updatedData,
					updatedAt: new Date().toISOString(),
				};
				newTasks[updatedData.status] = [...newTasks[updatedData.status], updatedTask];
			} else {
				// Update task in current column
				column[taskIndex] = {
					...column[taskIndex],
					...updatedData,
					updatedAt: new Date().toISOString(),
				};
			}

			return newTasks;
		});
	};

	const deleteTask = (columnId, taskId) => {
		setTasks((prev) => ({
			...prev,
			[columnId]: prev[columnId].filter((task) => task.id !== taskId),
		}));
	};

	// Project management functions
	const addProject = (projectData) => {
		const newProject = {
			id: uuidv4(),
			name: projectData.name,
			description: projectData.description || "",
			status: projectData.status || "planning",
			startDate: projectData.startDate || new Date().toISOString().split("T")[0],
			endDate: projectData.endDate,
			teamMembers: projectData.teamMembers || [],
			progress: projectData.progress || 0,
			priority: projectData.priority || "medium",
			department: projectData.department || "Engineering",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			tags: projectData.tags || [],
			milestones: projectData.milestones || [],
		};

		setProjects((prev) => [...prev, newProject]);
		return newProject;
	};

	const updateProject = (projectId, updatedData) => {
		setProjects((prev) =>
			prev.map((project) =>
				project.id === projectId
					? {
							...project,
							...updatedData,
							updatedAt: new Date().toISOString(),
					  }
					: project
			)
		);
	};

	const deleteProject = (projectId) => {
		setProjects((prev) => prev.filter((project) => project.id !== projectId));

		// Clean up related tasks
		setTasks((prev) => {
			const newTasks = { ...prev };
			Object.keys(newTasks).forEach((column) => {
				newTasks[column] = newTasks[column].filter((task) => task.projectId !== projectId);
			});
			return newTasks;
		});
	};

	// Team management functions
	const addTeamMember = (memberData) => {
		const newMember = {
			id: uuidv4(),
			name: memberData.name,
			role: memberData.role || "",
			department: memberData.department || "",
			email: memberData.email || "",
			avatar: memberData.avatar || null,
			status: "active",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			skills: memberData.skills || [],
			projects: [],
			tasks: [],
		};

		setTeam((prev) => [...prev, newMember]);
		return newMember;
	};

	const updateTeamMember = (memberId, updatedData) => {
		setTeam((prev) =>
			prev.map((member) =>
				member.id === memberId
					? {
							...member,
							...updatedData,
							updatedAt: new Date().toISOString(),
					  }
					: member
			)
		);
	};

	const deleteTeamMember = (memberId) => {
		// Remove member from team
		setTeam((prev) => prev.filter((member) => member.id !== memberId));

		// Remove member from projects
		setProjects((prev) =>
			prev.map((project) => ({
				...project,
				teamMembers: project.teamMembers.filter((id) => id !== memberId),
			}))
		);

		// Unassign tasks
		setTasks((prev) => {
			const newTasks = { ...prev };
			Object.keys(newTasks).forEach((column) => {
				newTasks[column] = newTasks[column].map((task) => {
					if (task.assignedTo === memberId) {
						return { ...task, assignedTo: null };
					}
					return task;
				});
			});
			return newTasks;
		});
	};

	// Event management functions
	const addEvent = (eventData) => {
		const newEvent = {
			id: uuidv4(),
			title: eventData.title,
			description: eventData.description || "",
			start: eventData.start,
			end: eventData.end,
			type: eventData.type || "general",
			projectId: eventData.projectId || null,
			attendees: eventData.attendees || [],
			location: eventData.location || "",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		setEvents((prev) => [...prev, newEvent]);
		return newEvent;
	};

	const updateEvent = (eventId, updatedData) => {
		setEvents((prev) =>
			prev.map((event) =>
				event.id === eventId
					? {
							...event,
							...updatedData,
							updatedAt: new Date().toISOString(),
					  }
					: event
			)
		);
	};

	const deleteEvent = (eventId) => {
		setEvents((prev) => prev.filter((event) => event.id !== eventId));
	};

	// Drag and drop handler
	const handleDragEnd = (result) => {
		const { source, destination } = result;

		if (!destination) return;
		if (source.droppableId === destination.droppableId && source.index === destination.index) return;

		setTasks((prev) => {
			const newTasks = { ...prev };
			const sourceColumn = [...newTasks[source.droppableId]];
			const destColumn = source.droppableId === destination.droppableId ? sourceColumn : [...newTasks[destination.droppableId]];

			const [removed] = sourceColumn.splice(source.index, 1);
			const updatedTask = {
				...removed,
				status: destination.droppableId,
				updatedAt: new Date().toISOString(),
			};

			destColumn.splice(destination.index, 0, updatedTask);

			return {
				...newTasks,
				[source.droppableId]: sourceColumn,
				[destination.droppableId]: destColumn,
			};
		});
	};

	return (
		<TaskContext.Provider
			value={{
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
			}}
		>
			{children}
		</TaskContext.Provider>
	);
};

export const useTaskContext = () => {
	const context = useContext(TaskContext);
	if (!context) {
		throw new Error("useTaskContext must be used within a TaskProvider");
	}
	return context;
};

export default TaskContext;
