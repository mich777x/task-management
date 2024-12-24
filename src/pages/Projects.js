import React, { useState, useEffect } from "react";
import { useTaskContext } from "../context/TaskContext";
import { Plus, Search, Filter, Edit, Trash2, Clock, Users } from "lucide-react";

const Projects = () => {
	const { projects, tasks, team, addProject, updateProject, deleteProject } = useTaskContext();
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentProject, setCurrentProject] = useState(null);
	const [projectMetrics, setProjectMetrics] = useState({});

	// Calculate project metrics when tasks or projects change
	useEffect(() => {
		const metrics = projects.reduce((acc, project) => {
			const projectTasks = Object.values(tasks)
				.flat()
				.filter((task) => task.projectId === project.id);

			const completedTasks = projectTasks.filter((task) => task.status === "Done").length;
			const totalTasks = projectTasks.length;

			acc[project.id] = {
				progress: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
				totalTasks,
				completedTasks,
				overdueTasks: projectTasks.filter((task) => new Date(task.dueDate) < new Date() && task.status !== "Done").length,
			};
			return acc;
		}, {});

		setProjectMetrics(metrics);
	}, [projects, tasks]);

	const ProjectModal = () => {
		const [formData, setFormData] = useState(
			currentProject || {
				name: "",
				description: "",
				startDate: "",
				endDate: "",
				status: "planning",
				priority: "medium",
				teamMembers: [],
			}
		);

		const handleSubmit = (e) => {
			e.preventDefault();
			if (currentProject) {
				updateProject(currentProject.id, formData);
			} else {
				addProject({
					...formData,
					id: Date.now().toString(),
				});
			}
			setIsModalOpen(false);
			setCurrentProject(null);
		};

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white rounded-xl p-6 w-full max-w-md">
					<h2 className="text-xl font-semibold mb-4">{currentProject ? "Edit Project" : "Create New Project"}</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
							<input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
							<textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" />
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
								<input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
								<input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
								<select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
									<option value="planning">Planning</option>
									<option value="in-progress">In Progress</option>
									<option value="completed">Completed</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
								<select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
								</select>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
							<select
								multiple
								value={formData.teamMembers}
								onChange={(e) =>
									setFormData({
										...formData,
										teamMembers: Array.from(e.target.selectedOptions, (option) => option.value),
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
									setCurrentProject(null);
								}}
								className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
							>
								Cancel
							</button>
							<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
								{currentProject ? "Update Project" : "Create Project"}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	// Filter projects based on search and status
	const filteredProjects = projects.filter((project) => {
		const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = filterStatus === "all" || project.status === filterStatus;
		return matchesSearch && matchesStatus;
	});

	const getStatusColor = (status) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "in-progress":
				return "bg-blue-100 text-blue-800";
			case "planning":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header and Controls */}
			<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
				<div className="flex items-center space-x-4">
					<button
						onClick={() => {
							setCurrentProject(null);
							setIsModalOpen(true);
						}}
						className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						<Plus className="w-5 h-5 mr-2" />
						New Project
					</button>
					<div className="relative">
						<input type="text" placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64" />
						<Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
					</div>
				</div>

				<div className="flex items-center space-x-4">
					<select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
						<option value="all">All Status</option>
						<option value="planning">Planning</option>
						<option value="in-progress">In Progress</option>
						<option value="completed">Completed</option>
					</select>
					<button className="p-2 text-gray-500 hover:text-gray-700">
						<Filter className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* Projects Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredProjects.map((project) => (
					<div key={project.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
						<div className="p-6">
							<div className="flex justify-between items-start">
								<div>
									<h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
									<p className="text-sm text-gray-500 mt-1">{project.description}</p>
								</div>
								<div className="flex items-center space-x-2">
									<button
										onClick={() => {
											setCurrentProject(project);
											setIsModalOpen(true);
										}}
										className="text-gray-500 hover:text-blue-600"
									>
										<Edit className="w-5 h-5" />
									</button>
									<button onClick={() => deleteProject(project.id)} className="text-gray-500 hover:text-red-600">
										<Trash2 className="w-5 h-5" />
									</button>
								</div>
							</div>

							<div className="mt-4">
								<div className="flex items-center justify-between mb-2">
									<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
									<span className="text-sm text-gray-500">
										{projectMetrics[project.id]?.completedTasks} / {projectMetrics[project.id]?.totalTasks} tasks
									</span>
								</div>

								<div className="w-full bg-gray-200 rounded-full h-2 mb-4">
									<div className="bg-blue-600 rounded-full h-2" style={{ width: `${projectMetrics[project.id]?.progress || 0}%` }} />
								</div>

								<div className="flex items-center justify-between text-sm text-gray-500">
									<div className="flex items-center space-x-2">
										<Clock className="w-4 h-4" />
										<span>{new Date(project.endDate).toLocaleDateString()}</span>
									</div>
									<div className="flex -space-x-2">
										{project.teamMembers?.slice(0, 3).map((memberId) => {
											const member = team.find((m) => m.id === memberId);
											return (
												<div key={memberId} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
													{member?.name?.charAt(0)}
												</div>
											);
										})}
										{project.teamMembers?.length > 3 && (
											<div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
												<span className="text-xs">+{project.teamMembers.length - 3}</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Project Modal */}
			{isModalOpen && <ProjectModal />}
		</div>
	);
};

export default Projects;
