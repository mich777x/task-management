import React, { useState } from "react";
import { Bell, User, Menu, Check, X, Plus } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";

export const Header = () => {
	const { notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const handleAddNotification = () => {
		const types = [
			{ title: "Task Updated", message: 'The task "Research competitors" was updated' },
			{ title: "New Comment", message: "John Doe commented on your task" },
			{ title: "Deadline Approaching", message: "A task is due in 2 days" },
			{ title: "Task Completed", message: "Team member completed their assigned task" },
		];
		const randomType = types[Math.floor(Math.random() * types.length)];
		addNotification(randomType);
	};

	const toggleNotifications = () => {
		setIsNotificationsOpen(!isNotificationsOpen);
		setIsUserMenuOpen(false);
	};

	const toggleUserMenu = () => {
		setIsUserMenuOpen(!isUserMenuOpen);
		setIsNotificationsOpen(false);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
		setIsNotificationsOpen(false);
		setIsUserMenuOpen(false);
	};

	return (
		<header className="bg-white border-b border-gray-200 relative">
			<div className="flex items-center justify-between px-6 py-4">
				<div className="flex items-center space-x-8">
					<h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
				</div>

				<div className="flex items-center space-x-4">
					{/* Notifications */}
					<div className="relative">
						<button onClick={toggleNotifications} className="relative p-1 rounded-full hover:bg-gray-100" aria-label="Notifications">
							<Bell className="w-5 h-5 text-gray-500" />
							{unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{unreadCount}</span>}
						</button>

						{isNotificationsOpen && (
							<div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
								<div className="p-3 border-b border-gray-200 flex justify-between items-center">
									<div className="flex items-center space-x-2">
										<h3 className="text-sm font-semibold">Notifications</h3>
										<button onClick={handleAddNotification} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700" title="Add notification">
											<Plus className="w-4 h-4" />
										</button>
									</div>
									<div className="space-x-2">
										<button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800">
											Mark all read
										</button>
										<button onClick={clearAll} className="text-xs text-gray-500 hover:text-gray-700">
											Clear all
										</button>
									</div>
								</div>
								<div className="max-h-96 overflow-y-auto">{notifications.length === 0 ? <div className="p-4 text-center text-gray-500 text-sm">No notifications</div> : notifications.map((notification) => <NotificationItem key={notification.id} notification={notification} onMarkAsRead={markAsRead} onDelete={deleteNotification} />)}</div>
							</div>
						)}
					</div>

					{/* User Menu */}
					<div className="relative">
						<button onClick={toggleUserMenu} className="p-1 rounded-full hover:bg-gray-100" aria-label="User menu">
							<User className="w-5 h-5 text-gray-500" />
						</button>

						{isUserMenuOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
								<div className="py-1">
									<button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Profile</button>
									<button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Settings</button>
									<button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Log out</button>
								</div>
							</div>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button onClick={toggleMobileMenu} className="p-1 rounded-full hover:bg-gray-100 md:hidden" aria-label="Mobile menu">
						{isMobileMenuOpen ? <X className="w-5 h-5 text-gray-500" /> : <Menu className="w-5 h-5 text-gray-500" />}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden border-t border-gray-200">
					<div className="py-2 space-y-1">
						<button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Profile</button>
						<button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Settings</button>
						<button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Log out</button>
					</div>
				</div>
			)}
		</header>
	);
};

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
	const timeAgo = (timestamp) => {
		const now = new Date();
		const past = new Date(timestamp);
		const diffInSeconds = Math.floor((now - past) / 1000);

		if (diffInSeconds < 60) return "just now";
		if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
		if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
		return `${Math.floor(diffInSeconds / 86400)}d ago`;
	};

	return (
		<div className={`p-3 hover:bg-gray-50 border-b last:border-b-0 ${notification.isRead ? "opacity-75" : ""}`}>
			<div className="flex items-center justify-between">
				<div className="flex-1">
					<p className="text-sm font-medium text-gray-900">{notification.title}</p>
					<p className="text-xs text-gray-600 mt-1">{notification.message}</p>
					<p className="text-xs text-gray-500 mt-1">{timeAgo(notification.timestamp)}</p>
				</div>
				<div className="flex items-center space-x-2 ml-2">
					{!notification.isRead && (
						<button onClick={() => onMarkAsRead(notification.id)} className="text-blue-600 hover:text-blue-800" title="Mark as read">
							<Check className="w-4 h-4" />
						</button>
					)}
					<button onClick={() => onDelete(notification.id)} className="text-gray-400 hover:text-red-500" title="Delete notification">
						<X className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Header;
