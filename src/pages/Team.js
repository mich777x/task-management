import React, { useState } from "react";
import { useTaskContext } from "../context/TaskContext";
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin } from "lucide-react";

const Team = () => {
	const { team, tasks, addTeamMember, updateTeamMember, deleteTeamMember } = useTaskContext();
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentMember, setCurrentMember] = useState(null);

	// Filter team members based on search
	const filteredTeam = team.filter((member) => member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.role.toLowerCase().includes(searchTerm.toLowerCase()));

	// Get member tasks
	const getMemberTasks = (memberId) => {
		return Object.values(tasks)
			.flat()
			.filter((task) => task.assignee?.id === memberId);
	};

	// Get initials for avatar
	const getInitials = (name) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase();
	};

	const TeamMemberModal = () => {
		const [formData, setFormData] = useState(
			currentMember || {
				name: "",
				role: "",
				email: "",
				phone: "",
				location: "",
				department: "Engineering",
				status: "active",
			}
		);

		const handleSubmit = (e) => {
			e.preventDefault();
			if (currentMember) {
				updateTeamMember(currentMember.id, formData);
			} else {
				addTeamMember({
					...formData,
					id: Date.now().toString(),
				});
			}
			setIsModalOpen(false);
			setCurrentMember(null);
		};

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white rounded-xl p-6 w-full max-w-md">
					<h2 className="text-xl font-semibold mb-4">{currentMember ? "Edit Team Member" : "Add Team Member"}</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
							<input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
								<input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
								<select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
									<option value="Engineering">Engineering</option>
									<option value="Design">Design</option>
									<option value="Marketing">Marketing</option>
									<option value="Sales">Sales</option>
									<option value="Support">Support</option>
								</select>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
							<input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
							<input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
							<input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
						</div>

						<div className="flex justify-end space-x-3">
							<button
								type="button"
								onClick={() => {
									setIsModalOpen(false);
									setCurrentMember(null);
								}}
								className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
							>
								Cancel
							</button>
							<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
								{currentMember ? "Update Member" : "Add Member"}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	return (
		<div className="space-y-6">
			{/* Header and Search */}
			<div className="flex justify-between items-center">
				<div className="flex items-center space-x-4">
					<button
						onClick={() => {
							setCurrentMember(null);
							setIsModalOpen(true);
						}}
						className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						<Plus className="w-5 h-5 mr-2" />
						Add Member
					</button>
					<div className="relative">
						<input type="text" placeholder="Search team members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64" />
						<Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
					</div>
				</div>
			</div>

			{/* Team Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredTeam.map((member) => {
					const memberTasks = getMemberTasks(member.id);
					const completedTasks = memberTasks.filter((task) => task.status === "Done").length;

					return (
						<div key={member.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
							<div className="p-6">
								<div className="flex items-start justify-between">
									<div className="flex items-center space-x-4">
										<div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-medium">{getInitials(member.name)}</div>
										<div>
											<h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
											<p className="text-sm text-gray-500">{member.role}</p>
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<button
											onClick={() => {
												setCurrentMember(member);
												setIsModalOpen(true);
											}}
											className="text-gray-500 hover:text-blue-600"
										>
											<Edit className="w-5 h-5" />
										</button>
										<button onClick={() => deleteTeamMember(member.id)} className="text-gray-500 hover:text-red-600">
											<Trash2 className="w-5 h-5" />
										</button>
									</div>
								</div>

								<div className="mt-4 space-y-2">
									<div className="flex items-center text-sm text-gray-500">
										<Mail className="w-4 h-4 mr-2" />
										{member.email}
									</div>
									{member.phone && (
										<div className="flex items-center text-sm text-gray-500">
											<Phone className="w-4 h-4 mr-2" />
											{member.phone}
										</div>
									)}
									{member.location && (
										<div className="flex items-center text-sm text-gray-500">
											<MapPin className="w-4 h-4 mr-2" />
											{member.location}
										</div>
									)}
								</div>

								<div className="mt-4">
									<div className="flex justify-between text-sm text-gray-500 mb-2">
										<span>Tasks Completed</span>
										<span>
											{completedTasks} / {memberTasks.length}
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-blue-600 rounded-full h-2"
											style={{
												width: `${memberTasks.length > 0 ? (completedTasks / memberTasks.length) * 100 : 0}%`,
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Member Modal */}
			{isModalOpen && <TeamMemberModal />}
		</div>
	);
};

export default Team;
