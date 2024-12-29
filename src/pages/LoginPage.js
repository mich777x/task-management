import React, { useState, useEffect } from "react";
import { LogIn, KeyRound, Mail, AlertCircle, Eye, EyeOff, Github, Loader2, ArrowRight, Info } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [loginStep, setLoginStep] = useState("email"); // email or password
	const [emailValid, setEmailValid] = useState(false);

	const { login } = useAuth();

	// Validate email as user types
	useEffect(() => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		setEmailValid(emailRegex.test(formData.email));
	}, [formData.email]);

	// Demo user hints
	const demoCredentials = [
		{ email: "demo@example.com", hint: "Demo User (Password: 123)" },
		{ email: "admin@taskflow.com", hint: "Admin User (Password: admin123)" },
	];

	const handleEmailSubmit = (e) => {
		e.preventDefault();
		if (emailValid) {
			setLoginStep("password");
		} else {
			setError("Please enter a valid email address");
		}
	};

	const handlePasswordSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			// Simulated delay for demo
			await new Promise((resolve) => setTimeout(resolve, 800));

			const validCredentials = [
				{
					email: "demo@example.com",
					password: "123",
					userData: {
						name: "Demo User",
						role: "Product Manager",
						avatar: null,
					},
				},
				{
					email: "admin@taskflow.com",
					password: "admin123",
					userData: {
						name: "Admin User",
						role: "Administrator",
						avatar: null,
					},
				},
			];

			const matchedUser = validCredentials.find((cred) => cred.email.toLowerCase() === formData.email.toLowerCase() && cred.password === formData.password);

			if (matchedUser) {
				login(matchedUser.userData);
			} else {
				setError("Invalid password");
				setFormData((prev) => ({ ...prev, password: "" }));
			}
		} catch (err) {
			console.error(err);
			setError("An error occurred. Please try again.");

			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	// Find if current email matches a demo account
	const demoHint = demoCredentials.find((cred) => cred.email.toLowerCase() === formData.email.toLowerCase());

	return (
		<div className="min-h-screen flex flex-col">
			{/* Top Navigation */}
			<nav className="w-full p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm fixed top-0 z-50">
				<div className="flex items-center space-x-2">
					<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
						<span className="text-white font-bold">TF</span>
					</div>
					<span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TaskFlow</span>
				</div>
				<a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
					<Github className="w-5 h-5 mr-2" />
					<span className="hidden sm:inline">Source</span>
				</a>
			</nav>

			{/* Main Content */}
			<main className="flex-1 flex">
				{/* Left Panel - Login Form */}
				<div className="w-full lg:w-1/2 flex items-center justify-center p-8">
					<div className="w-full max-w-md space-y-8">
						<div className="text-center lg:text-left">
							<h1 className="text-2xl font-bold text-gray-900">{loginStep === "email" ? "Sign in to TaskFlow" : `Welcome back`}</h1>
							<p className="mt-2 text-gray-600">{loginStep === "email" ? "Enter your email to get started" : `Signing in as ${formData.email}`}</p>
						</div>

						{/* Error Message */}
						{error && (
							<div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
								<AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
								<span className="text-sm">{error}</span>
							</div>
						)}

						{/* Login Forms */}
						{loginStep === "email" ? (
							// Email Step
							<form onSubmit={handleEmailSubmit} className="space-y-6">
								<div>
									<div className="relative">
										<Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
										<input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })} placeholder="demo@example.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" autoFocus />
										{emailValid && (
											<div className="absolute right-3 top-3.5 text-green-500">
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
												</svg>
											</div>
										)}
									</div>
								</div>

								<button
									type="submit"
									disabled={!emailValid}
									className="w-full py-3 px-4 flex items-center justify-center text-white bg-blue-600 rounded-lg 
                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-all"
								>
									Continue
									<ArrowRight className="w-5 h-5 ml-2" />
								</button>

								{/* Demo Account Hint */}
								{demoHint && (
									<div className="flex items-start space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
										<Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
										<p>{demoHint.hint}</p>
									</div>
								)}
							</form>
						) : (
							// Password Step
							<form onSubmit={handlePasswordSubmit} className="space-y-6">
								<div>
									<div className="relative">
										<KeyRound className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
										<input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter your password" className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" autoFocus />
										<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
											{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
										</button>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<button
										type="button"
										onClick={() => {
											setLoginStep("email");
											setError("");
										}}
										className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
									>
										<ArrowRight className="w-4 h-4 mr-1 rotate-180" />
										Change email
									</button>
									<button type="button" className="text-sm text-blue-600 hover:text-blue-700">
										Forgot password?
									</button>
								</div>

								<button
									type="submit"
									disabled={isLoading || !formData.password}
									className="w-full py-3 px-4 flex items-center justify-center text-white bg-blue-600 rounded-lg 
                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-all"
								>
									{isLoading ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										<>
											Sign in
											<LogIn className="w-5 h-5 ml-2" />
										</>
									)}
								</button>
							</form>
						)}
					</div>
				</div>

				{/* Right Panel - Illustration (Only visible on lg screens) */}
				<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-8">
					<div className="max-w-md text-center">
						<div className="w-full h-64 bg-white rounded-2xl shadow-xl p-8 mb-8 flex items-center justify-center">
							<svg className="w-full h-full text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
							</svg>
						</div>
						<h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to TaskFlow</h2>
						<p className="text-gray-600">Streamline your workflow, collaborate seamlessly, and boost productivity with our intuitive task management platform.</p>
					</div>
				</div>
			</main>
		</div>
	);
};

export default LoginPage;
