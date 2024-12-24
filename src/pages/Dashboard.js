import React, { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar, Clock, Users, Folder, Activity, AlertTriangle } from "lucide-react";
import { useTaskContext } from "../context/TaskContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
	const { tasks, projects, team, events } = useTaskContext();
	const [taskMetrics, setTaskMetrics] = useState({});
	const [projectStats, setProjectStats] = useState([]);
	const [teamActivity, setTeamActivity] = useState([]);
	const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

	useEffect(() => {
		calculateTaskMetrics();
		generateProjectStats();
		analyzeTeamActivity();
		getUpcomingDeadlines();
	}, [tasks, projects, team, events]);

	const calculateTaskMetrics = () => {
		const allTasks = Object.values(tasks).flat();
		const today = new Date();
		const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

		const metrics = {
			total: allTasks.length,
			completed: tasks["Done"]?.length || 0,
			inProgress: tasks["In Progress"]?.length || 0,
			overdue: allTasks.filter((task) => new Date(task.dueDate) < today && task.status !== "Done").length,
			completedThisWeek: tasks["Done"]?.filter((task) => new Date(task.completedAt) > thisWeek).length || 0,
			highPriority: allTasks.filter((task) => task.priority === "high").length,
		};

		setTaskMetrics(metrics);
	};

	const generateProjectStats = () => {
		const projectProgress = projects.map((project) => ({
			name: project.name,
			completed: project.completedTasks || 0,
			total: project.totalTasks || 0,
			progress: Math.round(((project.completedTasks || 0) / (project.totalTasks || 1)) * 100),
		}));

		setProjectStats(projectProgress);
	};

	const analyzeTeamActivity = () => {
		const memberActivity = team.map((member) => ({
			name: member.name,
			tasksCompleted: tasks["Done"]?.filter((task) => task.assignee?.id === member.id).length || 0,
			tasksInProgress: tasks["In Progress"]?.filter((task) => task.assignee?.id === member.id).length || 0,
		}));

		setTeamActivity(memberActivity);
	};

	const getUpcomingDeadlines = () => {
		const today = new Date();
		const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

		const deadlines = Object.values(tasks)
			.flat()
			.filter((task) => {
				const dueDate = new Date(task.dueDate);
				return dueDate >= today && dueDate <= nextWeek && task.status !== "Done";
			})
			.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

		setUpcomingDeadlines(deadlines.slice(0, 5));
	};

	// Calculate project distribution data
	const projectStatusData = [
		{ name: "Planning", value: projects.filter((p) => p.status === "planning").length },
		{ name: "In Progress", value: projects.filter((p) => p.status === "in-progress").length },
		{ name: "Review", value: projects.filter((p) => p.status === "review").length },
		{ name: "Completed", value: projects.filter((p) => p.status === "completed").length },
	];

	return (
		<div className="space-y-6 p-6">
			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-white rounded-xl p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-500 text-sm">Total Tasks</p>
							<h3 className="text-2xl font-bold mt-1">{taskMetrics.total}</h3>
							<p className="text-sm text-gray-600 mt-1">{taskMetrics.completedThisWeek} completed this week</p>
						</div>
						<div className="bg-blue-100 p-3 rounded-full">
							<Activity className="w-6 h-6 text-blue-600" />
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-500 text-sm">Active Projects</p>
							<h3 className="text-2xl font-bold mt-1">{projects.filter((p) => p.status !== "completed").length}</h3>
							<p className="text-sm text-gray-600 mt-1">{projects.filter((p) => p.status === "in-progress").length} in progress</p>
						</div>
						<div className="bg-green-100 p-3 rounded-full">
							<Folder className="w-6 h-6 text-green-600" />
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-500 text-sm">Team Members</p>
							<h3 className="text-2xl font-bold mt-1">{team.length}</h3>
							<p className="text-sm text-gray-600 mt-1">{team.filter((m) => m.status === "active").length} active now</p>
						</div>
						<div className="bg-purple-100 p-3 rounded-full">
							<Users className="w-6 h-6 text-purple-600" />
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-500 text-sm">Upcoming Events</p>
							<h3 className="text-2xl font-bold mt-1">{events.length}</h3>
							<p className="text-sm text-gray-600 mt-1">{events.filter((e) => new Date(e.start) > new Date()).length} this week</p>
						</div>
						<div className="bg-yellow-100 p-3 rounded-full">
							<Calendar className="w-6 h-6 text-yellow-600" />
						</div>
					</div>
				</div>
			</div>

			{/* Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Project Progress Chart */}
				<div className="bg-white rounded-xl p-6 shadow-sm">
					<h3 className="text-lg font-semibold mb-4">Project Progress</h3>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={projectStats}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="completed" fill="#0088FE" name="Completed Tasks" />
							<Bar dataKey="total" fill="#00C49F" name="Total Tasks" />
						</BarChart>
					</ResponsiveContainer>
				</div>

				{/* Team Activity Chart */}
				<div className="bg-white rounded-xl p-6 shadow-sm">
					<h3 className="text-lg font-semibold mb-4">Team Activity</h3>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={teamActivity}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line type="monotone" dataKey="tasksCompleted" stroke="#0088FE" name="Completed Tasks" />
							<Line type="monotone" dataKey="tasksInProgress" stroke="#00C49F" name="Tasks in Progress" />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Bottom Row */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Project Distribution */}
				<div className="bg-white rounded-xl p-6 shadow-sm">
					<h3 className="text-lg font-semibold mb-4">Project Distribution</h3>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie data={projectStatusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
								{projectStatusData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</div>

				{/* Upcoming Deadlines */}
				<div className="bg-white rounded-xl p-6 shadow-sm col-span-2">
					<h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
					<div className="space-y-4">
						{upcomingDeadlines.map((task) => (
							<div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
								<div className="flex items-center space-x-4">
									<div
										className={`
                    p-2 rounded-full
                    ${task.priority === "high" ? "bg-red-100" : task.priority === "medium" ? "bg-yellow-100" : "bg-green-100"}`}
									>
										<AlertTriangle className={`w-4 h-4 ${task.priority === "high" ? "text-red-600" : task.priority === "medium" ? "text-yellow-600" : "text-green-600"}`} />
									</div>
									<div>
										<h4 className="font-medium">{task.title}</h4>
										<p className="text-sm text-gray-500">{task.assignee?.name || "Unassigned"}</p>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<Clock className="w-4 h-4 text-gray-400" />
									<span className="text-sm text-gray-600">{new Date(task.dueDate).toLocaleDateString()}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
