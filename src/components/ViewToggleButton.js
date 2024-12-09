export const ViewToggleButton = ({ isActive, onClick, label }) => {
	return (
		<button onClick={onClick} className={`px-4 py-2 rounded-md ${isActive ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
			{label}
		</button>
	);
};
