import React, { createContext, useContext } from "react";
import { useTaskManager } from "../hooks/useTaskManagement";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
	const { tasks, projects, team, events, addTask, updateTask, deleteTask, handleDragEnd, addProject, updateProject, deleteProject, addTeamMember, updateTeamMember, deleteTeamMember, addEvent, updateEvent, deleteEvent } = useTaskManager();

	return <TaskContext.Provider value={{ tasks, projects, team, events, addTask, updateTask, deleteTask, handleDragEnd, addProject, updateProject, deleteProject, addTeamMember, updateTeamMember, deleteTeamMember, addEvent, updateEvent, deleteEvent }}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
	const context = useContext(TaskContext);
	if (!context) {
		throw new Error("useTaskContext must be used within a TaskProvider");
	}
	return context;
};
