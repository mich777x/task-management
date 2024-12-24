import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Contexts
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";

// Import Pages
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import LoginPage from "./pages/LoginPage";

// Import Components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? (
		<div className="flex min-h-screen bg-gray-100">
			<Sidebar />
			<main className="flex-1">
				<Header />
				<div className="p-6">{children}</div>
			</main>
			<ToastContainer />
		</div>
	) : (
		<Navigate to="/login" replace />
	);
};

const App = () => {
	return (
		<AuthProvider>
			<TaskProvider>
				<Routes>
					{/* Public Routes */}
					<Route path="/login" element={<LoginPage />} />

					{/* Protected Routes */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/projects"
						element={
							<ProtectedRoute>
								<Projects />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/team"
						element={
							<ProtectedRoute>
								<Team />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/tasks"
						element={
							<ProtectedRoute>
								<Tasks />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/calendar"
						element={
							<ProtectedRoute>
								<Calendar />
							</ProtectedRoute>
						}
					/>

					{/* Redirect to dashboard by default */}
					<Route path="/" element={<Navigate to="/dashboard" replace />} />
				</Routes>
			</TaskProvider>
		</AuthProvider>
	);
};

export default App;
