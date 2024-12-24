import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Folder, Users, Calendar, Kanban } from "lucide-react";

const Sidebar = () => {
	const location = useLocation();

	const menuItems = [
		{
			path: "/dashboard",
			icon: LayoutGrid,
			label: "Dashboard",
		},
		{
			path: "/projects",
			icon: Folder,
			label: "Projects",
		},
		{
			path: "/team",
			icon: Users,
			label: "Team",
		},
		{
			path: "/calendar",
			icon: Calendar,
			label: "Calendar",
		},
		{
			path: "/tasks",
			icon: Kanban,
			label: "Tasks",
		},
	];

	return (
		<div className="w-64 bg-white border-r">
			<div className="p-6">
				<h2 className="text-2xl font-bold mb-8">TaskFlow</h2>
				<nav className="space-y-2">
					{menuItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={`
                flex items-center p-3 rounded-md transition
                ${location.pathname === item.path ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}
              `}
						>
							<item.icon className="w-5 h-5 mr-3" />
							<span>{item.label}</span>
						</Link>
					))}
				</nav>
			</div>
		</div>
	);
};

export default Sidebar;
