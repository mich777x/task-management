import React, { useState, useEffect } from "react";
import { useTaskContext } from "../context/TaskContext";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Clock } from "lucide-react";

const Calendar = () => {
	const { events, tasks, team, addEvent, updateEvent, deleteEvent } = useTaskContext();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentEvent, setCurrentEvent] = useState(null);
	const [filteredEvents, setFilteredEvents] = useState([]);

	// Combine tasks and events
	useEffect(() => {
		const taskEvents = Object.values(tasks)
			.flat()
			.map((task) => ({
				id: `task-${task.id}`,
				title: task.title,
				start: new Date(task.dueDate),
				end: new Date(task.dueDate),
				type: "deadline",
				priority: task.priority,
				assignee: task.assignee,
			}));

		setFilteredEvents([...events, ...taskEvents]);
	}, [events, tasks]);

	const EventModal = () => {
		const [formData, setFormData] = useState(
			currentEvent || {
				title: "",
				description: "",
				start: selectedDate || new Date(),
				end: selectedDate || new Date(),
				type: "meeting",
				location: "",
				attendees: [],
			}
		);

		const handleSubmit = (e) => {
			e.preventDefault();
			if (currentEvent) {
				updateEvent(currentEvent.id, formData);
			} else {
				addEvent({
					...formData,
					id: Date.now().toString(),
				});
			}
			setIsModalOpen(false);
			setCurrentEvent(null);
		};

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white rounded-xl p-6 w-full max-w-md">
					<h2 className="text-xl font-semibold mb-4">{currentEvent ? "Edit Event" : "Create New Event"}</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
							<input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
								<input type="datetime-local" value={format(new Date(formData.start), "yyyy-MM-dd'T'HH:mm")} onChange={(e) => setFormData({ ...formData, start: new Date(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">End</label>
								<input type="datetime-local" value={format(new Date(formData.end), "yyyy-MM-dd'T'HH:mm")} onChange={(e) => setFormData({ ...formData, end: new Date(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
							<textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" />
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
							<select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
								<option value="meeting">Meeting</option>
								<option value="deadline">Deadline</option>
								<option value="reminder">Reminder</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
							<select
								multiple
								value={formData.attendees}
								onChange={(e) =>
									setFormData({
										...formData,
										attendees: Array.from(e.target.selectedOptions, (option) => option.value),
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg"
							>
								{team.map((member) => (
									<option key={member.id} value={member.id}>
										{member.name}
									</option>
								))}
							</select>
						</div>

						<div className="flex justify-end space-x-3">
							<button
								type="button"
								onClick={() => {
									setIsModalOpen(false);
									setCurrentEvent(null);
								}}
								className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
							>
								Cancel
							</button>
							<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
								{currentEvent ? "Update Event" : "Create Event"}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	const generateCalendarDays = () => {
		const monthStart = startOfMonth(currentDate);
		const monthEnd = endOfMonth(currentDate);
		const startDate = startOfWeek(monthStart);
		const endDate = endOfWeek(monthEnd);

		return eachDayOfInterval({ start: startDate, end: endDate });
	};

	const getEventsForDate = (date) => {
		return filteredEvents.filter((event) => isSameDay(new Date(event.start), date));
	};

	const getEventStyle = (event) => {
		switch (event.type) {
			case "meeting":
				return "bg-blue-100 text-blue-800";
			case "deadline":
				return "bg-red-100 text-red-800";
			case "reminder":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			{/* Calendar Header */}
			<div className="flex justify-between items-center">
				<div className="flex items-center space-x-4">
					<h1 className="text-2xl font-bold text-gray-900">{format(currentDate, "MMMM yyyy")}</h1>
					<div className="flex items-center space-x-2">
						<button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-full">
							<ChevronLeft className="w-5 h-5" />
						</button>
						<button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-full">
							<ChevronRight className="w-5 h-5" />
						</button>
					</div>
				</div>

				<button
					onClick={() => {
						setCurrentEvent(null);
						setIsModalOpen(true);
					}}
					className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
				>
					<Plus className="w-5 h-5 mr-2" />
					Add Event
				</button>
			</div>

			{/* Calendar Grid */}
			<div className="bg-white rounded-xl shadow-sm">
				{/* Week Names */}
				<div className="grid grid-cols-7 border-b">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
						<div key={day} className="px-4 py-3 text-sm font-medium text-gray-500 text-center">
							{day}
						</div>
					))}
				</div>

				{/* Calendar Days */}
				<div className="grid grid-cols-7 gap-px bg-gray-200">
					{generateCalendarDays().map((date) => {
						const dayEvents = getEventsForDate(date);
						const isCurrentMonth = isSameMonth(date, currentDate);
						const isToday = isSameDay(date, new Date());

						return (
							<div
								key={date.toISOString()}
								onClick={() => {
									setSelectedDate(date);
									setCurrentEvent(null);
									setIsModalOpen(true);
								}}
								className={`
                  min-h-32 bg-white p-2
                  ${!isCurrentMonth && "bg-gray-50 text-gray-400"}
                  ${isToday && "ring-2 ring-blue-500"}
                  hover:bg-gray-50 cursor-pointer
                `}
							>
								<div className="flex justify-between">
									<span
										className={`
                    text-sm font-medium
                    ${isToday ? "bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center" : ""}
                  `}
									>
										{format(date, "d")}
									</span>
									{dayEvents.length > 0 && <span className="text-xs bg-blue-100 text-blue-800 px-2 rounded-full">{dayEvents.length}</span>}
								</div>

								<div className="mt-1 space-y-1">
									{dayEvents.slice(0, 3).map((event) => (
										<div
											key={event.id}
											onClick={(e) => {
												e.stopPropagation();
												setCurrentEvent(event);
												setIsModalOpen(true);
											}}
											className={`${getEventStyle(event)} px-2 py-1 text-xs rounded-lg truncate`}
										>
											{event.title}
										</div>
									))}
									{dayEvents.length > 3 && <div className="text-xs text-gray-500 pl-2">+{dayEvents.length - 3} more</div>}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Event Modal */}
			{isModalOpen && <EventModal />}
		</div>
	);
};

export default Calendar;
