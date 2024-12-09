export const TaskForm = ({ task, onChange, statuses, currentStatus, onStatusChange }) => {
	return (
		<div className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-700">Title</label>
				<input type="text" value={task.title} onChange={(e) => onChange({ ...task, title: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700">Priority</label>
				<select value={task.priority} onChange={(e) => onChange({ ...task, priority: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
				</select>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700">Due Date</label>
				<input type="date" value={task.dueDate} onChange={(e) => onChange({ ...task, dueDate: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
			</div>
			{task.id && (
				<div>
					<label className="block text-sm font-medium text-gray-700">Status</label>
					<select value={currentStatus} onChange={(e) => onStatusChange(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
						{statuses.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
				</div>
			)}
		</div>
	);
};
