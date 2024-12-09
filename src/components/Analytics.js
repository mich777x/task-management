import React from "react";
import { BarChart2, CheckCircle, AlertCircle, Clock4 } from "lucide-react";
import { MetricCard } from "./MetricCard";

export const Analytics = ({ tasks }) => {
	const calculateMetrics = () => {
		const allTasks = Object.values(tasks).flat();
		const totalTasks = allTasks.length;
		const completedTasks = tasks["Done"]?.length || 0;
		const highPriorityTasks = allTasks.filter((task) => task.priority === "high").length;
		const upcomingDeadlines = allTasks.filter((task) => {
			const dueDate = new Date(task.dueDate);
			const today = new Date();
			const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
			return diffDays <= 7 && diffDays > 0;
		}).length;

		return {
			totalTasks,
			completedTasks,
			highPriorityTasks,
			upcomingDeadlines,
			completionRate: totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0,
		};
	};

	const metrics = calculateMetrics();

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
			<MetricCard title="Total Tasks" value={metrics.totalTasks} Icon={CheckCircle} color="blue" />
			<MetricCard title="Completion Rate" value={`${metrics.completionRate}%`} Icon={BarChart2} color="green" />
			<MetricCard title="High Priority" value={metrics.highPriorityTasks} Icon={AlertCircle} color="red" />
			<MetricCard title="Upcoming Deadlines" value={metrics.upcomingDeadlines} Icon={Clock4} color="yellow" />
		</div>
	);
};
