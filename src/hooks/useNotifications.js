// src/hooks/useNotifications.js
import { useState, useEffect } from "react";

export const useNotifications = () => {
	const [notifications, setNotifications] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem("notifications")) || [];
		} catch {
			return [];
		}
	});

	useEffect(() => {
		localStorage.setItem("notifications", JSON.stringify(notifications));
	}, [notifications]);

	const addNotification = (notification) => {
		const newNotification = {
			id: Date.now(),
			timestamp: new Date().toISOString(),
			isRead: false,
			...notification,
		};
		setNotifications((prev) => [newNotification, ...prev]);
	};

	const markAsRead = (id) => {
		setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)));
	};

	const markAllAsRead = () => {
		setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
	};

	const deleteNotification = (id) => {
		setNotifications((prev) => prev.filter((notif) => notif.id !== id));
	};

	const clearAll = () => {
		setNotifications([]);
	};

	return {
		notifications,
		addNotification,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		clearAll,
	};
};
