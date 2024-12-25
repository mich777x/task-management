import React, { useState, useEffect } from "react";
import { useTaskContext } from "../context/TaskContext";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Users, Calendar, CheckCircle, Activity } from "lucide-react";

const Dashboard = () => {
	const navigate = useNavigate();
	const { tasks, projects, team, events = [] } = useTaskContext();
	const [taskMetrics, setTaskMetrics] = useState({});
	const [projectMetrics, setProjectMetrics] = useState({});
	const [teamMetrics, setTeamMetrics] = useState({});

	// Calculate metrics whenever data changes
	useEffect(() => {
		// Task Metrics
		const allTasks = Object.values(tasks || {}).flat();
		const totalTasks = allTasks.length;
		const completedTasks = (tasks?.["Done"] || []).length;
		const inProgressTasks = (tasks?.["In Progress"] || []).length;
		const pendingTasks = (tasks?.["To Do"] || []).length;
		const reviewTasks = (tasks?.["Review"] || []).length;

		const tasksByPriority = allTasks.reduce((acc, task) => {
			acc[task.priority] = (acc[task.priority] || 0) + 1;
			return acc;
		}, {});

		// Project Metrics
		const activeProjects = (projects || []).filter((p) => p.status === "in-progress").length;
		const completedProjects = (projects || []).filter((p) => p.status === "completed").length;
		const projectProgress = (projects || []).reduce(
			(acc, project) => {
				acc.total += project.progress || 0;
				return acc;
			},
			{ total: 0 }
		);

		const avgProjectProgress = projects?.length ? (projectProgress.total / projects.length).toFixed(1) : 0;

		// Team Metrics
		const departmentDistribution = (team || []).reduce((acc, member) => {
			acc[member.department] = (acc[member.department] || 0) + 1;
			return acc;
		}, {});

		setTaskMetrics({
			total: totalTasks,
			completed: completedTasks,
			inProgress: inProgressTasks,
			pending: pendingTasks,
			review: reviewTasks,
			completionRate: totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0,
			byPriority: tasksByPriority,
		});

		setProjectMetrics({
			total: projects?.length || 0,
			active: activeProjects,
			completed: completedProjects,
			avgProgress: avgProjectProgress,
		});

		setTeamMetrics({
			total: team?.length || 0,
			departments: departmentDistribution,
			activeMembers: (team || []).filter((m) => m.status === "online").length,
		});
	}, [tasks, projects, team]);

	// Chart colors
	const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

	// Task distribution data
	const taskDistributionData = [
		{ name: "To Do", value: taskMetrics.pending || 0 },
		{ name: "In Progress", value: taskMetrics.inProgress || 0 },
		{ name: "Review", value: taskMetrics.review || 0 },
		{ name: "Done", value: taskMetrics.completed || 0 },
	];

	// Project progress data
	const projectProgressData = (projects || []).map((project) => ({
		name: project.name,
		progress: project.progress || 0,
	}));

	// Team activity data (last 7 days)
	const getTeamActivityData = () => {
		const today = new Date();
		const last7Days = new Array(7).fill(0).map((_, index) => {
			const date = new Date();
			date.setDate(today.getDate() - (6 - index));
			return date.toISOString().split("T")[0];
		});

		return last7Days.map((date) => {
			const dayTasks = Object.values(tasks || {})
				.flat()
				.filter((task) => task.createdAt?.startsWith(date));

			return {
				date,
				tasks: dayTasks.length,
				completed: dayTasks.filter((task) => task.status === "Done").length,
			};
		});
	};

	return (
		<div className="space-y-6">
			{/* Clickable Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div onClick={() => navigate("/tasks")} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500">Total Tasks</p>
							<h3 className="text-2xl font-bold mt-1">{taskMetrics.total}</h3>
							<p className="text-sm text-green-600 mt-2 flex items-center">
								<TrendingUp className="w-4 h-4 mr-1" />+{taskMetrics.completionRate}% completed
							</p>
						</div>
						<div className="p-3 bg-blue-50 rounded-full">
							<Activity className="w-6 h-6 text-blue-600" />
						</div>
					</div>
				</div>

				<div onClick={() => navigate("/projects")} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500">Active Projects</p>
							<h3 className="text-2xl font-bold mt-1">{projectMetrics.active}</h3>
							<p className="text-sm text-blue-600 mt-2">Avg. Progress: {projectMetrics.avgProgress}%</p>
						</div>
						<div className="p-3 bg-green-50 rounded-full">
							<CheckCircle className="w-6 h-6 text-green-600" />
						</div>
					</div>
				</div>

				<div onClick={() => navigate("/team")} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500">Team Members</p>
							<h3 className="text-2xl font-bold mt-1">{teamMetrics.total}</h3>
							<p className="text-sm text-emerald-600 mt-2">{teamMetrics.activeMembers} members online</p>
						</div>
						<div className="p-3 bg-yellow-50 rounded-full">
							<Users className="w-6 h-6 text-yellow-600" />
						</div>
					</div>
				</div>

				<div onClick={() => navigate("/calendar")} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500">Upcoming Events</p>
							<h3 className="text-2xl font-bold mt-1">{events.filter((e) => new Date(e.start) > new Date()).length}</h3>
							<p className="text-sm text-purple-600 mt-2">Next 7 days</p>
						</div>
						<div className="p-3 bg-purple-50 rounded-full">
							<Calendar className="w-6 h-6 text-purple-600" />
						</div>
					</div>
				</div>
			</div>
			{/* Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Task Distribution */}
				<div className="bg-white p-6 rounded-lg shadow-sm">
					<h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie data={taskDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" dataKey="value" label>
									{taskDistributionData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Project Progress */}
				<div className="bg-white p-6 rounded-lg shadow-sm">
					<h3 className="text-lg font-semibold mb-4">Project Progress</h3>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={projectProgressData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="progress" fill="#3b82f6" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			{/* Team Activity Chart */}
			<div className="bg-white p-6 rounded-lg shadow-sm">
				<h3 className="text-lg font-semibold mb-4">Team Activity</h3>
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={getTeamActivityData()}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { weekday: "short" })} />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line type="monotone" dataKey="tasks" stroke="#3b82f6" name="New Tasks" strokeWidth={2} />
							<Line type="monotone" dataKey="completed" stroke="#10b981" name="Completed Tasks" strokeWidth={2} />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Recent Activity */}
			<div className="bg-white rounded-lg p-6 shadow-sm">
				<h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
				<div className="space-y-4">
					{Object.values(tasks || {})
						.flat()
						.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
						.slice(0, 5)
						.map((task) => (
							<div key={task.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
								<div>
									<h4 className="font-medium text-gray-900">{task.title}</h4>
									<p className="text-sm text-gray-500">
										{task.assignee ? `Assigned to ${task.assignee}` : "Unassigned"} • Due: {new Date(task.dueDate).toLocaleDateString()}
									</p>
								</div>
								<span
									className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${task.priority === "high" ? "bg-red-100 text-red-800" : task.priority === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}
                `}
								>
									{task.priority} Priority
								</span>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
