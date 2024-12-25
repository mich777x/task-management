import React, { useState } from "react";
import { Plus, Search, Edit, Trash2, Calendar, CheckCircle } from "lucide-react";
import { useTaskContext } from "../context/TaskContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Projects = () => {
	const { projects, addProject, updateProject, deleteProject, tasks, team } = useTaskContext();
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentProject, setCurrentProject] = useState(null);

	// Project Modal Component
	const ProjectModal = () => {
		const [formData, setFormData] = useState(
			currentProject || {
				name: "",
				description: "",
				status: "planning",
				startDate: new Date().toISOString().split("T")[0],
				endDate: "",
				teamMembers: [],
				progress: 0,
			}
		);

		const handleSubmit = (e) => {
			e.preventDefault();

			if (new Date(formData.endDate) < new Date(formData.startDate)) {
				toast.error("End date cannot be before start date");
				return;
			}

			if (currentProject) {
				updateProject(currentProject.id, formData);
				toast.success("Project updated successfully");
			} else {
				addProject({
					...formData,
					createdAt: new Date().toISOString(),
					id: Date.now().toString(),
				});
				toast.success("Project created successfully");
			}
			setIsModalOpen(false);
			setCurrentProject(null);
		};

		const handleTeamMemberToggle = (memberId) => {
			const updatedMembers = formData.teamMembers.includes(memberId) ? formData.teamMembers.filter((id) => id !== memberId) : [...formData.teamMembers, memberId];

			setFormData({ ...formData, teamMembers: updatedMembers });
		};

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white rounded-lg p-6 w-full max-w-md">
					<h2 className="text-xl font-semibold mb-4">{currentProject ? "Edit Project" : "Create New Project"}</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
							<input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
							<textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3" />
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
								<input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
								<input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
							<select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
								<option value="planning">Planning</option>
								<option value="in-progress">In Progress</option>
								<option value="completed">Completed</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
							<input
								type="number"
								min="0"
								max="100"
								value={formData.progress}
								onChange={(e) =>
									setFormData({
										...formData,
										progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
							<div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto">
								{team.map((member) => (
									<div key={member.id} className="flex items-center p-2 hover:bg-gray-50">
										<input type="checkbox" checked={formData.teamMembers.includes(member.id)} onChange={() => handleTeamMemberToggle(member.id)} className="mr-2" />
										<span>{member.name}</span>
									</div>
								))}
							</div>
						</div>

						<div className="flex justify-end space-x-3">
							<button
								type="button"
								onClick={() => {
									setIsModalOpen(false);
									setCurrentProject(null);
								}}
								className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
							>
								Cancel
							</button>
							<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
								{currentProject ? "Update" : "Create"}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	// Get status color
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

	// Get project metrics
	const getProjectMetrics = (projectId) => {
		const projectTasks = Object.values(tasks)
			.flat()
			.filter((task) => task.projectId === projectId);

		return {
			totalTasks: projectTasks.length,
			completedTasks: projectTasks.filter((task) => task.status === "Done").length,
		};
	};

	// Get team member info
	const getTeamMemberInfo = (memberId) => {
		return team.find((member) => member.id === memberId);
	};

	// Filter projects
	const filteredProjects = projects.filter((project) => {
		const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = filterStatus === "all" || project.status === filterStatus;
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="space-y-6">
			{/* Header and Filters */}
			<div className="flex flex-col sm:flex-row justify-between gap-4">
				<div className="flex space-x-4">
					<button
						onClick={() => {
							setIsModalOpen(true);
							setCurrentProject(null);
						}}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700"
					>
						<Plus className="w-5 h-5 mr-2" />
						New Project
					</button>
					<div className="relative">
						<input type="text" placeholder="Search projects..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
						<Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
					</div>
				</div>
				<select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
					<option value="all">All Status</option>
					<option value="planning">Planning</option>
					<option value="in-progress">In Progress</option>
					<option value="completed">Completed</option>
				</select>
			</div>

			{/* Projects Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredProjects.map((project) => {
					const metrics = getProjectMetrics(project.id);

					return (
						<div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
							<div className="p-6">
								<div className="flex justify-between items-start">
									<h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
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
										<button
											onClick={() => {
												if (window.confirm("Are you sure you want to delete this project?")) {
													deleteProject(project.id);
													toast.success("Project deleted successfully");
												}
											}}
											className="text-gray-500 hover:text-red-600"
										>
											<Trash2 className="w-5 h-5" />
										</button>
									</div>
								</div>

								<p className="text-sm text-gray-500 mt-2">{project.description}</p>

								<div className="mt-4 space-y-3">
									{/* Progress Bar */}
									<div>
										<div className="flex justify-between items-center mb-1">
											<span className="text-sm text-gray-500">Progress</span>
											<span className="text-sm font-medium text-gray-900">{project.progress}%</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-blue-600 rounded-full h-2 transition-all duration-300" style={{ width: `${project.progress}%` }} />
										</div>
									</div>

									{/* Project Details */}
									<div className="grid grid-cols-2 gap-3">
										<div className="flex items-center text-sm">
											<Calendar className="w-4 h-4 text-gray-400 mr-2" />
											<span className="text-gray-600">{new Date(project.startDate).toLocaleDateString()}</span>
										</div>
										<div className="flex items-center text-sm">
											<CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
											<span className="text-gray-600">
												{metrics.completedTasks}/{metrics.totalTasks} Tasks
											</span>
										</div>
									</div>

									{/* Team Members */}
									<div className="flex flex-wrap gap-2">
										{project.teamMembers?.map((memberId) => {
											const member = getTeamMemberInfo(memberId);
											if (!member) return null;

											return (
												<div key={member.id} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
													{member.name}
												</div>
											);
										})}
									</div>

									{/* Status */}
									<div className="flex justify-between items-center">
										<span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Project Modal */}
			{isModalOpen && <ProjectModal />}

			{/* No Projects Found */}
			{filteredProjects.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-500">No projects found matching your criteria</p>
				</div>
			)}

			{/* Toast Container */}
			<ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
		</div>
	);
};

export default Projects;
