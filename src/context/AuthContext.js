import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Create AuthContext with default values
const AuthContext = createContext({
	user: null,
	isAuthenticated: false,
	login: () => {},
	logout: () => {},
	updateProfile: () => {},
});

// AuthProvider Component
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();

	// Check for existing user on initial load
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			try {
				const parsedUser = JSON.parse(storedUser);
				setUser(parsedUser);
				setIsAuthenticated(true);
			} catch (error) {
				console.error("Error parsing stored user:", error);
			}
		}
	}, []);

	// Login method
	const login = (userData) => {
		setUser(userData);
		setIsAuthenticated(true);
		localStorage.setItem("user", JSON.stringify(userData));
		toast.success(`Welcome back, ${userData.name}!`);
		navigate("/dashboard");
	};

	// Logout method
	const logout = () => {
		setUser(null);
		setIsAuthenticated(false);
		localStorage.removeItem("user");
		toast.info("You have been logged out");
		navigate("/login");
	};

	// Update user profile
	const updateProfile = (updatedUser) => {
		const mergedUser = { ...user, ...updatedUser };
		setUser(mergedUser);
		localStorage.setItem("user", JSON.stringify(mergedUser));
		toast.success("Profile updated successfully");
	};

	// Value to be provided to consumers
	const contextValue = {
		user,
		isAuthenticated,
		login,
		logout,
		updateProfile,
	};

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
	const context = useContext(AuthContext);

	// Throw an error if used outside of AuthProvider
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};

export default AuthContext;
