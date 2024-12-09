import React from "react";
import { Plus, Search, BarChart2 } from "lucide-react";
import { ViewToggleButton } from "./ViewToggleButton";

export const Controls = ({ searchTerm, onSearchChange, filterPriority, onFilterChange, onAddClick, isAnalyticsVisible, onToggleAnalytics, view, onViewChange }) => {
	return (
		<div className="space-y-4 mb-6">
			<div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center justify-between">
				<div className="flex space-x-4">
					<button onClick={onAddClick} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
						<Plus className="w-4 h-4 mr-2" />
						Add Task
					</button>
					<div className="relative">
						<input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
						<Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
					</div>
				</div>
				<div className="flex space-x-4">
					<select value={filterPriority} onChange={(e) => onFilterChange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
						<option value="all">All Priorities</option>
						<option value="high">High Priority</option>
						<option value="medium">Medium Priority</option>
						<option value="low">Low Priority</option>
					</select>
					<button onClick={onToggleAnalytics} className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
						<BarChart2 className="w-4 h-4 mr-2" />
						{isAnalyticsVisible ? "Hide Analytics" : "Show Analytics"}
					</button>
				</div>
			</div>
			<div className="flex space-x-4">
				<ViewToggleButton isActive={view === "board"} onClick={() => onViewChange("board")} label="Board View" />
				<ViewToggleButton isActive={view === "timeline"} onClick={() => onViewChange("timeline")} label="Timeline View" />
			</div>
		</div>
	);
};
