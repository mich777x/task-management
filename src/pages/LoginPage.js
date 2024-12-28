import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogIn, User, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { login } = useAuth();
	const navigate = useNavigate();

	const validateForm = () => {
		if (!formData.email) {
			setError("Email is required");
			return false;
		}
		if (!formData.password) {
			setError("Password is required");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Basic form validation
		if (!validateForm()) return;

		setIsLoading(true);

		try {
			// Simulated authentication
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Demo credentials
			const validCredentials = [
				{
					email: "demo@example.com",
					password: "123",
					userData: {
						name: "John Doe",
						email: "demo@example.com",
						role: "Product Manager",
						avatar: null,
						activity: {
							tasksCompleted: 24,
							tasksCreated: 45,
							lastActive: new Date().toISOString(),
						},
					},
				},
				{
					email: "admin@taskflow.com",
					password: "admin123",
					userData: {
						name: "Admin User",
						email: "admin@taskflow.com",
						role: "System Administrator",
						avatar: null,
						activity: {
							tasksCompleted: 50,
							tasksCreated: 75,
							lastActive: new Date().toISOString(),
						},
					},
				},
			];

			const matchedCredential = validCredentials.find((cred) => cred.email === formData.email && cred.password === formData.password);

			if (matchedCredential) {
				login(matchedCredential.userData);

				toast.success(`Welcome back, ${matchedCredential.userData.name}!`, {
					position: "top-right",
					autoClose: 3000,
				});

				navigate("/dashboard");
			} else {
				setError("Invalid email or password");
				toast.error("Authentication failed", {
					position: "top-right",
					autoClose: 3000,
				});
			}
		} catch (err) {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h1 className="text-center text-4xl font-extrabold text-gray-900 mb-8">TaskFlow</h1>

				<div className="bg-white py-8 px-4 shadow-lg rounded-xl sm:px-10">
					<form className="space-y-6" onSubmit={handleSubmit}>
						{/* Error Message */}
						{error && (
							<div className="flex items-center p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
								<AlertCircle className="w-5 h-5 mr-2" />
								<span className="text-sm">{error}</span>
							</div>
						)}

						{/* Email Input */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700">
								Email address
							</label>
							<div className="mt-1 relative">
								<input id="email" name="email" type="email" autoComplete="email" required placeholder="demo@example.com" className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
								<User className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
							</div>
						</div>

						{/* Password Input */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<div className="mt-1 relative">
								<input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder="123" className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
								<Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
								<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
									{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
								</button>
							</div>
						</div>

						{/* Remember Me & Forgot Password */}
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
								<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
									Remember me
								</label>
							</div>

							<div className="text-sm">
								<a href="X" className="font-medium text-blue-600 hover:text-blue-500">
									Forgot your password?
								</a>
							</div>
						</div>

						{/* Login Button */}
						<div>
							<button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
								{isLoading ? (
									<div className="flex items-center">
										<svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
										</svg>
										Signing in...
									</div>
								) : (
									<>
										<LogIn className="w-5 h-5 mr-2" />
										Sign in
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
