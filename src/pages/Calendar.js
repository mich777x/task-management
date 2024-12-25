import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Users, LinkIcon } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns";
import { useTaskContext } from "../context/TaskContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
	const navigate = useNavigate();
	const { events, addEvent, updateEvent, deleteEvent, tasks, projects, team } = useTaskContext();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentEvent, setCurrentEvent] = useState(null);

	// Event Modal Component
	const EventModal = () => {
		const [formData, setFormData] = useState(
			currentEvent || {
				title: "",
				description: "",
				start: selectedDate ? new Date(selectedDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
				end: selectedDate ? new Date(selectedDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
				type: "meeting",
				location: "",
				projectId: "",
				attendees: [],
				relatedTaskId: "",
			}
		);

		// Get related tasks for selected project
		const getProjectTasks = () => {
			if (!formData.projectId) return [];
			return Object.values(tasks)
				.flat()
				.filter((task) => task.projectId === formData.projectId);
		};

		const handleSubmit = (e) => {
			e.preventDefault();

			if (new Date(formData.end) < new Date(formData.start)) {
				toast.error("End time cannot be before start time");
				return;
			}

			try {
				if (currentEvent) {
					updateEvent(currentEvent.id, formData);
					toast.success("Event updated successfully");
				} else {
					addEvent(formData);
					toast.success("Event created successfully");
				}
				setIsModalOpen(false);
				setCurrentEvent(null);
			} catch (error) {
				console.error("Error saving event:", error);
				toast.error("Error saving event");
			}
		};

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
				<div className="bg-white rounded-lg p-6 w-full max-w-md my-8">
					<h2 className="text-xl font-semibold mb-4">{currentEvent ? "Edit Event" : "Add New Event"}</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
							<input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
							<textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3" />
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
								<input type="datetime-local" value={formData.start} onChange={(e) => setFormData({ ...formData, start: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
								<input type="datetime-local" value={formData.end} onChange={(e) => setFormData({ ...formData, end: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Related Project</label>
							<select
								value={formData.projectId}
								onChange={(e) =>
									setFormData({
										...formData,
										projectId: e.target.value,
										relatedTaskId: "", // Reset task when project changes
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
							>
								<option value="">Select Project</option>
								{projects.map((project) => (
									<option key={project.id} value={project.id}>
										{project.name}
									</option>
								))}
							</select>
						</div>

						{formData.projectId && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Related Task</label>
								<select value={formData.relatedTaskId} onChange={(e) => setFormData({ ...formData, relatedTaskId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
									<option value="">Select Task</option>
									{getProjectTasks().map((task) => (
										<option key={task.id} value={task.id}>
											{task.title}
										</option>
									))}
								</select>
							</div>
						)}

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
							<div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto">
								{team.map((member) => (
									<div key={member.id} className="flex items-center p-2 hover:bg-gray-50">
										<input
											type="checkbox"
											checked={formData.attendees.includes(member.id)}
											onChange={(e) => {
												const newAttendees = e.target.checked ? [...formData.attendees, member.id] : formData.attendees.filter((id) => id !== member.id);
												setFormData({ ...formData, attendees: newAttendees });
											}}
											className="mr-2"
										/>
										<span>{member.name}</span>
									</div>
								))}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
							<input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Event location (optional)" />
						</div>

						<div className="flex justify-end space-x-3">
							<button
								type="button"
								onClick={() => {
									setIsModalOpen(false);
									setCurrentEvent(null);
								}}
								className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
							>
								Cancel
							</button>
							<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
								{currentEvent ? "Update Event" : "Add Event"}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	// Generate calendar days
	const generateCalendarDays = () => {
		const monthStart = startOfMonth(currentDate);
		const monthEnd = endOfMonth(currentDate);
		return eachDayOfInterval({ start: monthStart, end: monthEnd });
	};

	// Get events for a specific date
	const getEventsForDate = (date) => {
		return events.filter((event) => isSameDay(parseISO(event.start), date));
	};

	// Change month
	const changeMonth = (increment) => {
		setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + increment, 1));
	};

	// Handle delete event
	const handleDeleteEvent = (eventId) => {
		if (window.confirm("Are you sure you want to delete this event?")) {
			deleteEvent(eventId);
			toast.success("Event deleted successfully");
		}
	};

	// Get event details
	const getEventDetails = (event) => {
		const project = projects.find((p) => p.id === event.projectId);
		const task = project
			? Object.values(tasks)
					.flat()
					.find((t) => t.id === event.relatedTaskId)
			: null;
		const attendeeNames = event.attendees.map((id) => team.find((member) => member.id === id)?.name).filter(Boolean);

		return { project, task, attendeeNames };
	};

	return (
		<div className="space-y-6">
			{/* Calendar Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<h2 className="text-2xl font-bold text-gray-900">{format(currentDate, "MMMM yyyy")}</h2>
					<div className="flex items-center space-x-2">
						<button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full">
							<ChevronLeft className="w-5 h-5" />
						</button>
						<button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full">
							<ChevronRight className="w-5 h-5" />
						</button>
					</div>
				</div>
				<button
					onClick={() => {
						setCurrentEvent(null);
						setIsModalOpen(true);
					}}
					className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700"
				>
					<Plus className="w-5 h-5 mr-2" />
					Add Event
				</button>
			</div>

			{/* Calendar Grid */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				{/* Weekday Headers */}
				<div className="grid grid-cols-7 bg-gray-50 border-b">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
						<div key={day} className="text-center py-2 text-sm font-semibold text-gray-600">
							{day}
						</div>
					))}
				</div>

				{/* Calendar Days */}
				<div className="grid grid-cols-7">
					{generateCalendarDays().map((date) => {
						const eventsForDay = getEventsForDate(date);
						const isToday = isSameDay(date, new Date());
						const isCurrentMonth = isSameMonth(date, currentDate);

						return (
							<div key={date.toISOString()} onClick={() => setSelectedDate(date)} className={`min-h-32 border-b border-r p-2 cursor-pointer ${isCurrentMonth ? "bg-white" : "bg-gray-50"} ${isToday ? "ring-2 ring-blue-500" : ""} hover:bg-gray-50`}>
								<div className="flex justify-between items-start">
									<span className={`text-sm font-medium ${!isCurrentMonth && "text-gray-400"} ${isToday && "text-blue-600"}`}>{date.getDate()}</span>
									{eventsForDay.length > 0 && <span className="text-xs bg-blue-100 text-blue-800 px-2 rounded-full">{eventsForDay.length}</span>}
								</div>
								<div className="mt-1 space-y-1">
									{eventsForDay.map((event) => (
										<div key={event.id} className="text-xs p-1 rounded bg-blue-50 truncate">
											{event.title}
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Selected Date Events */}
			{selectedDate && (
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-xl font-semibold text-gray-900">Events on {format(selectedDate, "MMMM d, yyyy")}</h3>
					</div>

					{getEventsForDate(selectedDate).map((event) => {
						const { project, task, attendeeNames } = getEventDetails(event);

						return (
							<div key={event.id} className="border-b pb-4 mb-4 last:border-b-0">
								<div className="flex justify-between items-start">
									<div>
										<h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
										<p className="text-sm text-gray-600">{event.description}</p>
										<div className="flex items-center space-x-3 text-sm text-gray-500 mt-2">
											<span>
												{format(parseISO(event.start), "h:mm a")} -{format(parseISO(event.end), "h:mm a")}
											</span>
											{event.location && <span>• {event.location}</span>}
										</div>

										{/* Related Items */}
										{(project || task || attendeeNames.length > 0) && (
											<div className="mt-3 space-y-2">
												{project && (
													<div onClick={() => navigate(`/projects`)} className="flex items-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
														<LinkIcon className="w-4 h-4 mr-1" />
														Project: {project.name}
													</div>
												)}
												{task && (
													<div onClick={() => navigate(`/tasks`)} className="flex items-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
														<LinkIcon className="w-4 h-4 mr-1" />
														Task: {task.title}
													</div>
												)}
												{attendeeNames.length > 0 && (
													<div className="flex items-center text-sm text-gray-600">
														<Users className="w-4 h-4 mr-1" />
														Attendees: {attendeeNames.join(", ")}
													</div>
												)}
											</div>
										)}
									</div>
									<div className="flex space-x-2">
										<button
											onClick={(e) => {
												e.stopPropagation();
												setCurrentEvent(event);
												setIsModalOpen(true);
											}}
											className="text-gray-500 hover:text-blue-600 p-1"
										>
											<Edit className="w-4 h-4" />
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteEvent(event.id);
											}}
											className="text-gray-500 hover:text-red-600 p-1"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>
						);
					})}

					{getEventsForDate(selectedDate).length === 0 && <p className="text-gray-500 text-center py-4">No events scheduled for this date</p>}
				</div>
			)}

			{/* Event Modal */}
			{isModalOpen && <EventModal />}
		</div>
	);
};

export default Calendar;
