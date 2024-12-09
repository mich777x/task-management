import React from "react";
import { X } from "lucide-react";

export const TaskModal = ({ task, onClose, onSave, onChange, statuses, currentStatus, onStatusChange }) => {
	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(task);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">{task.id ? "Edit Task" : "Create New Task"}</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						<X className="w-5 h-5" />
					</button>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
						<input type="text" value={task.title} onChange={(e) => onChange({ ...task, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter task title" required />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
						<select value={task.priority} onChange={(e) => onChange({ ...task, priority: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
						<input type="date" value={task.dueDate} onChange={(e) => onChange({ ...task, dueDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
						<input type="text" value={task.assignee} onChange={(e) => onChange({ ...task, assignee: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter assignee name" />
					</div>
					{task.id && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
							<select value={currentStatus} onChange={(e) => onStatusChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
								{statuses.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</div>
					)}
					<div className="flex justify-end space-x-3 mt-6">
						<button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
							Cancel
						</button>
						<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
							{task.id ? "Save Changes" : "Create Task"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
