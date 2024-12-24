import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Search as SearchIcon } from "lucide-react";

// Default context value to prevent undefined errors
const defaultSearchContext = {
	searchTerm: "",
	setSearchTerm: () => {},
	searchScope: "all",
	setSearchScope: () => {},
	performSearch: (items) => items,
};

// Create context with default value
const SearchContext = createContext(defaultSearchContext);

// Search Provider Component
export function SearchProvider({ children }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [searchScope, setSearchScope] = useState("all");

	// Comprehensive search function
	const performSearch = useCallback(
		(items, scope = searchScope) => {
			if (!searchTerm) return items;

			const normalizedSearchTerm = searchTerm.toLowerCase().trim();

			// Handle different types of search scopes
			return items.filter((item) => {
				// Convert item to lowercase strings for case-insensitive search
				const searchableValues = Object.values(item)
					.filter((val) => val !== null && val !== undefined)
					.map((val) => String(val).toLowerCase());

				// Check if any value matches the search term
				return searchableValues.some((value) => value.includes(normalizedSearchTerm));
			});
		},
		[searchTerm, searchScope]
	);

	// Memoized context value
	const value = useMemo(
		() => ({
			searchTerm,
			setSearchTerm,
			searchScope,
			setSearchScope,
			performSearch,
		}),
		[searchTerm, searchScope, performSearch]
	);

	return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

// Custom hook for using search context
export function useSearch() {
	return useContext(SearchContext);
}

// Global Search Component
export function GlobalSearch() {
	const { searchTerm, setSearchTerm, searchScope, setSearchScope } = useSearch();

	return (
		<div className="flex items-center space-x-4 w-full max-w-md">
			<div className="relative flex-grow">
				<input type="text" placeholder="Search across TaskFlow..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
				<SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
			</div>
			<select value={searchScope} onChange={(e) => setSearchScope(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
				<option value="all">All</option>
				<option value="tasks">Tasks</option>
				<option value="projects">Projects</option>
				<option value="team">Team</option>
				<option value="events">Events</option>
			</select>
		</div>
	);
}
