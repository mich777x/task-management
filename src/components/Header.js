import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Header = () => {
	const [showNotifications, setShowNotifications] = useState(false);
	const [showProfileDropdown, setShowProfileDropdown] = useState(false);

	const dropdownRef = useRef(null);
	const notificationRef = useRef(null);

	const { user, logout } = useAuth();
	const navigate = useNavigate();

	// Handle click outside to close dropdowns
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowProfileDropdown(false);
			}
			if (notificationRef.current && !notificationRef.current.contains(event.target)) {
				setShowNotifications(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Mock notifications (in a real app, this would come from a context or API)
	const notifications = [
		{
			id: 1,
			title: "New Task Assigned",
			message: 'You have been assigned to "Update API documentation"',
			time: "5m ago",
		},
		{
			id: 2,
			title: "Project Deadline",
			message: 'The deadline for "Mobile App Redesign" has been changed',
			time: "1h ago",
		},
		{
			id: 3,
			title: "Team Meeting",
			message: "Daily standup meeting in 30 minutes",
			time: "2h ago",
		},
	];

	// Get user initials for avatar
	const getInitials = (name) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase();
	};

	// Handle logout
	const handleLogout = () => {
		logout();
		toast.info("You have been logged out");
		navigate("/login");
	};

	return (
		<header className="bg-white border-b border-gray-200 sticky top-0 z-40">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-end h-16">
					{/* Right side buttons */}
					<div className="flex items-center space-x-4">
						{/* Notifications */}
						<div className="relative" ref={notificationRef}>
							<button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
								<Bell className="w-6 h-6" />
								{notifications.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />}
							</button>

							{/* Notifications Dropdown */}
							{showNotifications && (
								<div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50">
									<div className="px-4 py-2 border-b border-gray-100">
										<h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
									</div>
									<div className="max-h-96 overflow-y-auto">
										{notifications.map((notification) => (
											<div key={notification.id} className="px-4 py-3 hover:bg-gray-50">
												<p className="text-sm font-medium text-gray-900">{notification.title}</p>
												<p className="text-sm text-gray-500 mt-1">{notification.message}</p>
												<p className="text-xs text-gray-400 mt-1">{notification.time}</p>
											</div>
										))}
									</div>
									<div className="px-4 py-2 border-t border-gray-100">
										<button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all notifications</button>
									</div>
								</div>
							)}
						</div>

						{/* Profile Dropdown */}
						<div className="relative" ref={dropdownRef}>
							<button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
								<div className="relative">
									{user?.avatar ? (
										<img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
									) : (
										<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
											<span className="text-white text-sm font-medium">{getInitials(user?.name || "User")}</span>
										</div>
									)}
									<span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white" />
								</div>
								<ChevronDown className="w-4 h-4 text-gray-500" />
							</button>

							{/* Profile Dropdown Menu */}
							{showProfileDropdown && (
								<div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-1 z-50">
									<div className="px-4 py-3 border-b border-gray-100">
										<p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
										<p className="text-sm text-gray-500">{user?.email || "user@example.com"}</p>
									</div>
									<div className="py-1 border-t border-gray-100">
										<button
											onClick={() => {
												setShowProfileDropdown(false);
												handleLogout();
											}}
											className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
										>
											<LogOut className="w-4 h-4 mr-3" />
											Sign out
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
